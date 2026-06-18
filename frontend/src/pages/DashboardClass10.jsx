import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Binary, Atom, Beaker, Dna, Compass, Scale, Globe, Coins, BookOpen, Languages, Scroll,
  ArrowRight, Clock, FileText, Video, CheckSquare, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const subjectIcons = {
  'Mathematics': Binary,
  'Physics': Atom,
  'Chemistry': Beaker,
  'Biology': Dna,
  'History': Compass,
  'Civics': Scale,
  'Civics (Political Science)': Scale,
  'Geography': Globe,
  'Economics': Coins,
  'English': BookOpen,
  'Hindi A': Languages,
  'Hindi B': Languages,
  'Sanskrit': Scroll,
};

const subjectColors = {
  'Mathematics': { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50', progress: '#3b82f6', glow: 'shadow-blue-500/5', gradient: 'from-blue-500/10 to-indigo-500/10' },
  'Physics': { text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50', progress: '#a855f7', glow: 'shadow-purple-500/5', gradient: 'from-purple-500/10 to-pink-500/10' },
  'Chemistry': { text: 'text-pink-500', bg: 'bg-pink-500/10', border: 'hover:border-pink-500/50', progress: '#ec4899', glow: 'shadow-pink-500/5', gradient: 'from-pink-500/10 to-rose-500/10' },
  'Biology': { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50', progress: '#10b981', glow: 'shadow-emerald-500/5', gradient: 'from-emerald-500/10 to-teal-500/10' },
  'History': { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/50', progress: '#f59e0b', glow: 'shadow-amber-500/5', gradient: 'from-amber-500/10 to-orange-500/10' },
  'Civics': { text: 'text-red-500', bg: 'bg-red-500/10', border: 'hover:border-red-500/50', progress: '#ef4444', glow: 'shadow-red-500/5', gradient: 'from-red-500/10 to-orange-500/10' },
  'Civics (Political Science)': { text: 'text-red-500', bg: 'bg-red-500/10', border: 'hover:border-red-500/50', progress: '#ef4444', glow: 'shadow-red-500/5', gradient: 'from-red-500/10 to-orange-500/10' },
  'Geography': { text: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/50', progress: '#06b6d4', glow: 'shadow-cyan-500/5', gradient: 'from-cyan-500/10 to-blue-500/10' },
  'Economics': { text: 'text-teal-500', bg: 'bg-teal-500/10', border: 'hover:border-teal-500/50', progress: '#10b981', glow: 'shadow-teal-500/5', gradient: 'from-teal-500/10 to-green-500/10' },
  'English': { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'hover:border-rose-500/50', progress: '#f43f5e', glow: 'shadow-rose-500/5', gradient: 'from-rose-500/10 to-red-500/10' },
  'Hindi A': { text: 'text-red-600', bg: 'bg-red-600/10', border: 'hover:border-red-600/50', progress: '#e11d48', glow: 'shadow-red-600/5', gradient: 'from-red-600/10 to-pink-600/10' },
  'Hindi B': { text: 'text-rose-600', bg: 'bg-rose-600/10', border: 'hover:border-rose-600/50', progress: '#f43f5e', glow: 'shadow-rose-600/5', gradient: 'from-rose-600/10 to-red-600/10' },
  'Sanskrit': { text: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50', progress: '#8b5cf6', glow: 'shadow-indigo-500/5', gradient: 'from-indigo-500/10 to-violet-500/10' },
};

const cardVariants = {
  hover: {
    scale: 1.04,
    y: -6,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

const SubjectCard = ({ sub, onClick, theme, icon: Icon, subjectChapters, progress }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / (box.height / 2) * 8);
    setRotateY(x / (box.width / 2) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const completedCount = subjectChapters.filter(c => 
    progress?.completedChapters?.some(pc => pc._id === c._id)
  ).length;
  const percentComplete = subjectChapters.length > 0 
    ? Math.round((completedCount / subjectChapters.length) * 100) 
    : 0;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      variants={cardVariants}
      whileHover="hover"
      className={`relative glass-card p-5 rounded-2xl border bg-gradient-to-br ${theme.gradient} ${theme.border} ${theme.glow} cursor-pointer transition-all duration-200 flex flex-col justify-between h-44`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.bg} ${theme.text} px-2 py-0.5 rounded`}>
            {sub.code || 'Core'}
          </span>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{sub.name}</h3>
        </div>
        
        <div className="relative flex items-center justify-center w-11 h-11">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-slate-200/50 dark:text-slate-800/80 stroke-current"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="stroke-current"
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                color: theme.progress,
                transition: 'stroke-dashoffset 0.5s ease-in-out'
              }}
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">
            {percentComplete}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 ${theme.bg} ${theme.text} rounded-lg shadow-inner`}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {completedCount} / {subjectChapters.length} Chapters
          </span>
        </div>
        <div className={`p-1.5 ${theme.bg} ${theme.text} rounded-lg`}>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

const DashboardClass10 = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [allChapters, setAllChapters] = useState({});
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [aiRecs, setAiRecs] = useState({ weakChapters: [], suggestions: '' });
  const [loading, setLoading] = useState(true);

  // Quick Study Timer values
  const [timerOpen, setTimerOpen] = useState(false);
  const [studyMinutes, setStudyMinutes] = useState(30);
  const [timerSubmitting, setTimerSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student subjects
        const subRes = await api.get('/student/subjects');
        if (subRes.data.success) {
          const fetchedSubjects = subRes.data.subjects;
          setSubjects(fetchedSubjects);

          // Fetch chapters for all subjects in parallel
          const chaptersPromises = fetchedSubjects.map((sub) =>
            api.get(`/student/subjects/${sub._id}/chapters`)
          );
          const chaptersResponses = await Promise.all(chaptersPromises);
          
          const chaptersMap = {};
          chaptersResponses.forEach((res, index) => {
            const subId = fetchedSubjects[index]._id;
            chaptersMap[subId] = res.data.success ? res.data.chapters : [];
          });
          setAllChapters(chaptersMap);

          // Default roadmap chapters
          if (fetchedSubjects.length > 0) {
            const firstSubId = fetchedSubjects[0]._id;
            setChapters(chaptersMap[firstSubId] || []);
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

  const customOrder = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Civics', 'Civics (Political Science)', 'Geography', 'Economics',
    'English', 'Hindi A', 'Hindi B', 'Sanskrit'
  ];

  const sortedSubjects = [...subjects].sort((a, b) => {
    const indexA = customOrder.indexOf(a.name);
    const indexB = customOrder.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center dark:bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative dark:bg-[#0b0f19]">
      {/* Interactive Background */}
      <AnimatedBackground />

      {/* Galaxy Universe Hero Header */}
      <GalaxyUniverse subjects={subjects} />

      {/* Performance Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600"><Clock className="h-6 w-6" /></div>
          <div>
            <div className="text-lg font-bold">{progress?.studyTime || 0} min</div>
            <div className="text-xs text-slate-500">Study Time</div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl border shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-600"><FileText className="h-6 w-6" /></div>
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

      {/* Main content layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left span: Subjects planetary cards & timer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Your Learning Universe</h2>
            <button
              onClick={() => setTimerOpen(true)}
              className="text-xs font-semibold text-blue-500 border border-blue-500/30 px-3.5 py-1.5 rounded-lg hover:bg-blue-500/5"
            >
              + Log Study Session
            </button>
          </div>

          {/* study time logging box */}
          {timerOpen && (
            <div className="glass-card p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 animate-pulse-slow space-y-4">
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
                  className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
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

          {/* Core Subjects cards grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {sortedSubjects.map((sub) => (
              <SubjectCard
                key={sub._id}
                sub={sub}
                onClick={() => navigate(`/subjects/${sub._id}`)}
                theme={subjectColors[sub.name] || { text: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50', progress: '#6366f1', glow: 'shadow-indigo-500/5', gradient: 'from-indigo-500/10 to-violet-500/10' }}
                icon={subjectIcons[sub.name] || BookOpen}
                subjectChapters={allChapters[sub._id] || []}
                progress={progress}
              />
            ))}
          </div>

          {/* Double Column Widget Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {/* SVG roadmap widget */}
            <RoadmapWidget subjectName={subjects[0]?.name} chapters={chapters} />
            {/* Consistency Heatmap */}
            <HeatmapWidget />
          </div>
        </div>

        {/* Right span: streaks, badges, daily challenge */}
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

export default DashboardClass10;
