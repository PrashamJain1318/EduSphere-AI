import React from 'react';
import { Flame, Star, Award } from 'lucide-react';

const StudyStreakWidget = ({ streakDays }) => {
  const weeklyStreak = Math.floor(streakDays / 7) || 0;
  const monthlyStreak = Math.floor(streakDays / 30) || 0;

  return (
    <div className="glass-card p-6 rounded-3xl border shadow-sm flex flex-col items-center justify-between gap-4 relative overflow-hidden h-full">
      {/* Flame glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Study Streak Engine</h3>

      {/* Animated Fire Flame */}
      <div className="relative flex justify-center items-center h-20 w-20">
        <div className="absolute h-14 w-14 bg-red-500 rounded-full filter blur-sm opacity-50 animate-pulse" />
        <div className="absolute h-10 w-10 bg-orange-500 rounded-full filter blur-xs animate-bounce" />
        <div className="absolute h-7 w-7 bg-yellow-400 rounded-full" />
        <Flame className="h-12 w-12 text-white relative z-10 fill-current animate-pulse-slow drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
      </div>

      <div className="text-center">
        <div className="text-3xl font-extrabold text-orange-500">{streakDays} Days</div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">Daily Study Streak</p>
      </div>

      {/* Weekly and Monthly metrics */}
      <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/20 text-center text-xs">
        <div className="p-2 bg-slate-100/30 dark:bg-slate-800/30 rounded-xl border border-slate-200/10">
          <div className="font-extrabold text-blue-500 flex items-center justify-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{weeklyStreak} Weeks</span>
          </div>
          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Weekly Milestone</span>
        </div>
        <div className="p-2 bg-slate-100/30 dark:bg-slate-800/30 rounded-xl border border-slate-200/10">
          <div className="font-extrabold text-purple-500 flex items-center justify-center gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>{monthlyStreak} Months</span>
          </div>
          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Monthly Milestone</span>
        </div>
      </div>
    </div>
  );
};

export default StudyStreakWidget;
