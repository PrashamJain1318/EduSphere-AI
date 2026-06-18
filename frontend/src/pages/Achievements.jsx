import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Award, Star, Flame, Trophy, Lock, Shield, CheckCircle2, AwardIcon } from 'lucide-react';
import api from '../utils/api.js';

const Achievements = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/leaderboard');
        if (res.data.success) {
          setLeaderboard(res.data.leaderboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const achievementsList = [
    {
      id: 'First Test Completed',
      title: 'First Test Completed',
      description: 'Finished your first practice MCQ worksheet successfully.',
      xpReward: 100,
      icon: <Award className="h-6 w-6 text-blue-500" />,
    },
    {
      id: '7-Day Streak',
      title: '7-Day Streak',
      description: 'Logged in to study for 7 days in a row.',
      xpReward: 200,
      icon: <Flame className="h-6 w-6 text-amber-500" />,
    },
    {
      id: 'Note Collector',
      title: 'Note Collector',
      description: 'Read at least 5 chapter notes PDFs.',
      xpReward: 150,
      icon: <Shield className="h-6 w-6 text-emerald-500" />,
    },
    {
      id: 'Video Scholar',
      title: 'Video Scholar',
      description: 'Watched 5 board review video lectures.',
      xpReward: 150,
      icon: <Trophy className="h-6 w-6 text-indigo-500" />,
    },
    {
      id: 'Perfect Score',
      title: 'Perfect Score',
      description: 'Achieved 100% accuracy on a practice MCQ test.',
      xpReward: 250,
      icon: <Star className="h-6 w-6 text-yellow-500" />,
    },
  ];

  const userBadges = user?.badges || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2.5 rounded-2xl text-white shadow-md">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Achievements & Rewards</h1>
          <p className="text-xs text-slate-500">Collect XP, maintain streaks, and unlock academic badges</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Stats Box & Leaderboard */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border shadow-sm text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Gamification Profile</h3>
            <div className="inline-flex items-center justify-center h-20 w-20 bg-amber-500/10 rounded-full text-amber-500">
              <Trophy className="h-10 w-10 animate-pulse" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{user?.xp || 0} XP</div>
              <div className="text-xs text-slate-500 mt-1">Accumulated Experience Points</div>
            </div>
            <div className="flex justify-center gap-6 pt-2 border-t border-slate-200/10 text-xs">
              <div>
                <span className="font-extrabold text-amber-500">{user?.streak || 0} days</span>
                <p className="text-[10px] text-slate-400">Current Streak</p>
              </div>
              <div>
                <span className="font-extrabold text-indigo-500">{userBadges.length}</span>
                <p className="text-[10px] text-slate-400">Badges Unlocked</p>
              </div>
            </div>
          </div>

          {/* Leaderboard snippet */}
          <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Flame className="h-4.5 w-4.5 text-orange-500" />
              <span>Leaderboard Standings</span>
            </h3>
            {loading ? (
              <div className="text-center py-4 text-xs text-slate-400">Loading rankings...</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((student, idx) => (
                  <div key={student._id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                      <span className="font-semibold">{student.name}</span>
                      {student._id === user?._id && (
                        <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded text-[8px] font-bold">You</span>
                      )}
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{student.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Badges List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">Unlocking Milestones Badges</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievementsList.map((ach) => {
              const isUnlocked = userBadges.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`glass-card p-5 rounded-2xl border flex gap-4 transition-all relative ${
                    isUnlocked
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-slate-200 opacity-60 dark:border-slate-800'
                  }`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 ${isUnlocked ? 'bg-white/60 dark:bg-slate-800' : 'bg-slate-200'}`}>
                    {isUnlocked ? ach.icon : <Lock className="h-6 w-6 text-slate-400" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                      <span>{ach.title}</span>
                      {isUnlocked && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">{ach.description}</p>
                    <span className="inline-block text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-2">
                      +{ach.xpReward} XP Reward
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
