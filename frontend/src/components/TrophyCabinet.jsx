import React from 'react';
import { Award, Flame, Shield, Trophy, Star, Lock } from 'lucide-react';

const TrophyCabinet = ({ badges }) => {
  const cabinetList = [
    { id: 'First Test Completed', title: 'First Test', icon: <Trophy className="h-6 w-6 text-blue-500" /> },
    { id: '7-Day Streak', title: '7-Day Streak', icon: <Flame className="h-6 w-6 text-amber-500" /> },
    { id: 'Note Collector', title: 'Notes Sage', icon: <Shield className="h-6 w-6 text-emerald-500" /> },
    { id: 'Video Scholar', title: 'Video Scholar', icon: <Award className="h-6 w-6 text-indigo-500" /> },
    { id: 'Perfect Score', title: 'Perfect MCQ', icon: <Star className="h-6 w-6 text-yellow-500 animate-spin" /> },
  ];

  const userBadges = badges || [];

  return (
    <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4 h-full relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl" />

      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b pb-3 border-slate-200/20">
        Trophy Cabinet
      </h3>

      {/* Grid Shelf */}
      <div className="grid grid-cols-5 gap-3 py-3 items-center justify-center text-center relative z-10">
        {cabinetList.map((item) => {
          const isUnlocked = userBadges.includes(item.id);
          return (
            <div key={item.id} className="flex flex-col items-center gap-1.5 group">
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-md group-hover:scale-110'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40'
                }`}
                title={isUnlocked ? `${item.id}: Unlocked!` : `${item.id}: Locked`}
              >
                {isUnlocked ? item.icon : <Lock className="h-4.5 w-4.5 text-slate-400" />}
              </div>
              <span className="text-[8px] font-bold text-slate-500 truncate max-w-[50px]">{item.title}</span>
            </div>
          );
        })}
      </div>

      <div className="text-[9px] text-slate-400 leading-normal border-t border-slate-200/10 pt-3 text-center">
        Unlocked <strong>{userBadges.length} / {cabinetList.length}</strong> master credentials badges.
      </div>
    </div>
  );
};

export default TrophyCabinet;
