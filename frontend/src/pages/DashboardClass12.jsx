import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BookOpen, Video, FileText, CheckSquare, Clock, Trophy, Flame, Zap, ArrowRight, Bot, Star, Sparkles, CheckCircle } from 'lucide-react';
import api from '../utils/api.js';
import { updateXPAndStreak } from '../store/slices/authSlice.js';

// Premium Visual widgets
import GalaxyUniverse from '../components/GalaxyUniverse.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import StudyStreakWidget from '../components/StudyStreakWidget.jsx';
import CountdownWidget from '../components/CountdownWidget.jsx';
import RoadmapWidget from '../components/RoadmapWidget.jsx';
import HeatmapWidget from '../components/HeatmapWidget.jsx';
import TrophyCabinet from '../components/TrophyCabinet.jsx';

const DashboardClass12 = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [aiRecs, setAiRecs] = useState({ weakChapters: [], suggestions: '' });
  const [loading, setLoading] = useState(true);

  // Quick Study Timer values
  const [timerOpen, setTimerOpen] = useState(false);
  const [studyMinutes, setStudyMinutes] = useState(45);
  const [timerSubmitting, setTimerSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student subjects (class 12 stream filtered by backend)
        const subRes = await api.get('/student/subjects');
        if (subRes.data.success) {
          setSubjects(subRes.data.subjects);
          // Fetch chapters for the first subject to show in Roadmap
          if (subRes.data.subjects.length > 0) {
            const chapRes = await api.get(`/student/subjects/${subRes.data.subjects[0]._id}/chapters`);
            if (chapRes.data.success) {
              setChapters(chapRes.data.chapters);
            }
          }
        }

        // Fetch progress
        const progRes = await api.get('/student/progress');
        if (progRes.data.success) {
          setProgress(progRes.data.progress);
        }

        // Fetch leaderboard
        const leadRes = await api.get('/student/leaderboard');
        if (leadRes.data.success) {
          setLeaderboard(leadRes.data.leaderboard);
        }

        // Fetch AI recommendations
        const aiRes = await api.get('/ai/recommendations');
        if (aiRes.data.success) {
          setAiRecs(aiRes.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddStudyTime = async () => {
    setTimerSubmitting(true);
    try {
      const res = await api.post('/student/progress', { studyMinutes });
      if (res.data.success) {
        setProgress(res.data.progress);
        dispatch(updateXPAndStreak({
          xp: res.data.totalXp,
          badges: res.data.badges
        }));
        setTimerOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimerSubmitting(false);
    }
  };

  const dailyChallenges = [
    { text: 'Read 2 chapter notes (+50 XP)', done: (progress?.notesRead?.length || 0) >= 2 },
    { text: 'Watch 3 lectures videos (+30 XP)', done: (progress?.videosWatched?.length || 0) >= 3 },
    { text: 'Attempt 1 custom AI quiz (+80 XP)', done: false },
  ];

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center dark:bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative dark:bg-[#0b0f19]">
      {/* Interactive background */}
      <AnimatedBackground />

      {/* Galaxy Universe Hero Header */}
      <GalaxyUniverse subjects={subjects} />

      {/* Stream Tag Display */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2.5 rounded-2xl shadow-md font-bold text-xs max-w-max">
        <Sparkles className="h-4 w-4 animate-spin text-yellow-300" />
        <span>Class 12 Boards preparator: {user?.stream} Stream active</span>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-600"><Clock className="h-6 w-6" /></div>
          <div>
            <div className="text-lg font-bold">{progress?.studyTime || 0} min</div>
            <div className="text-xs text-slate-500">Study Time</div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-pink-500/10 rounded-xl text-pink-600"><FileText className="h-6 w-6" /></div>
          <div>
            <div className="text-lg font-bold">{progress?.notesRead?.length || 0}</div>
            <div className="text-xs text-slate-500">Notes Read</div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600"><Video className="h-6 w-6" /></div>
          <div>
            <div className="text-lg font-bold">{progress?.videosWatched?.length || 0}</div>
            <div className="text-xs text-slate-500">Videos Watched</div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600"><CheckSquare className="h-6 w-6" /></div>
          <div>
            <div className="text-lg font-bold">{progress?.completedChapters?.length || 0}</div>
            <div className="text-xs text-slate-500">Chapters Done</div>
          </div>
        </div>
      </div>

      {/* Main grids */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left span: Subjects and timers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Curriculum Subjects</h2>
            <button
              onClick={() => setTimerOpen(true)}
              className="text-xs font-semibold text-indigo-500 border border-indigo-500/30 px-3.5 py-1.5 rounded-lg hover:bg-indigo-500/5"
            >
              + Log Study Session
            </button>
          </div>

          {/* study logger form */}
          {timerOpen && (
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 animate-pulse-slow space-y-4">
              <h3 className="text-sm font-bold">Record Study Session</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(parseInt(e.target.value, 10))}
                  className="w-24 p-2 rounded-lg border text-sm text-center"
                />
                <span className="text-xs text-slate-500">minutes studying today. (+5 XP per 10 mins)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddStudyTime}
                  disabled={timerSubmitting}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Save Progress
                </button>
                <button
                  onClick={() => setTimerOpen(false)}
                  className="text-xs text-slate-500 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Subjects grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub._id}
                onClick={() => navigate(`/subjects/${sub._id}`)}
                className="glass-card p-6 rounded-2xl border hover:border-indigo-500/50 cursor-pointer transition-all tilt-card flex flex-col justify-between h-40"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
                    {sub.code || 'Core'}
                  </span>
                  <h3 className="text-lg font-bold mt-3">{sub.name}</h3>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 border-t pt-3 border-slate-200/20">
                  <span>Syllabus Active</span>
                  <ArrowRight className="h-4 w-4 text-indigo-500" />
                </div>
              </div>
            ))}
          </div>

          {/* Double Column Widget Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* SVG roadmap widget */}
            <RoadmapWidget subjectName={subjects[0]?.name} chapters={chapters} />
            {/* Consistency Heatmap */}
            <HeatmapWidget />
          </div>
        </div>

        {/* Right span: widgets streaks, countdowns, trophy cabinets */}
        <div className="space-y-6">
          {/* Daily Streak Fire */}
          <StudyStreakWidget streakDays={user?.streak || 0} />

          {/* Exam Countdown */}
          <CountdownWidget />

          {/* Badge Trophy cabinet */}
          <TrophyCabinet badges={user?.badges} />

          {/* Daily Challenges */}
          <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-3 border-slate-200/20">
              Daily Challenges
            </h3>
            <div className="space-y-3">
              {dailyChallenges.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <CheckCircle className={`h-5 w-5 ${item.done ? 'text-green-500 fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                  <span className={item.done ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClass12;
