import React from 'react';
import { CalendarRange } from 'lucide-react';

const HeatmapWidget = () => {
  // Generate mock study activity for the last 15 weeks (105 days)
  // 0: none, 1: low (red/orange), 2: moderate (yellow), 3: high (green)
  const generateActivityData = () => {
    const data = [];
    const seedValues = [0, 0, 1, 0, 3, 2, 0, 2, 3, 0, 1, 0, 2, 3, 3, 0, 0, 1, 2, 0, 3];
    for (let i = 0; i < 98; i++) {
      const val = seedValues[i % seedValues.length];
      data.push(val);
    }
    // Set today (last element) as active
    data[data.length - 1] = 3;
    return data;
  };

  const activityData = generateActivityData();

  const getCellColor = (level) => {
    switch (level) {
      case 3:
        return 'bg-emerald-500 shadow-sm shadow-emerald-500/20'; // High study
      case 2:
        return 'bg-yellow-400'; // Moderate study
      case 1:
        return 'bg-orange-500'; // Low study
      default:
        return 'bg-slate-200 dark:bg-slate-800'; // No study
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4 h-full relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center border-b pb-3 border-slate-200/20">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <CalendarRange className="h-4.5 w-4.5 text-emerald-500" />
          <span>Learning Consistency Heatmap</span>
        </h3>
        <span className="text-[9px] text-slate-400">Last 14 Weeks</span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-rows-7 grid-flow-col gap-1 overflow-x-auto pb-2 scrollbar">
        {activityData.map((level, idx) => (
          <div
            key={idx}
            className={`h-2.5 w-2.5 rounded-sm transition-all hover:scale-125 cursor-pointer ${getCellColor(level)}`}
            title={`Day ${idx + 1}: Study Level ${level === 3 ? 'Max' : level === 2 ? 'Medium' : level === 1 ? 'Intro' : 'Zero'}`}
          />
        ))}
      </div>

      {/* Legends indicator */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 pt-2 border-t border-slate-200/10">
        <span>Less consistent</span>
        <div className="flex items-center space-x-1.5">
          <div className="h-2 w-2 rounded-sm bg-slate-200 dark:bg-slate-800" />
          <div className="h-2 w-2 rounded-sm bg-orange-500" />
          <div className="h-2 w-2 rounded-sm bg-yellow-400" />
          <div className="h-2 w-2 rounded-sm bg-emerald-500" />
        </div>
        <span>More consistent</span>
      </div>
    </div>
  );
};

export default HeatmapWidget;
