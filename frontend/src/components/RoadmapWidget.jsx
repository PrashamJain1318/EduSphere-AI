import React from 'react';
import { Check, Play, Lock, AlertCircle } from 'lucide-react';

const RoadmapWidget = ({ subjectName, chapters }) => {
  // Fallback sample data if chapters are not supplied
  const defaultRoadmap = [
    { name: 'Chapter 1: Units and Measurements', status: 'completed' },
    { name: 'Chapter 2: Motion in a Straight Line', status: 'completed' },
    { name: 'Chapter 3: Laws of Motion', status: 'active' },
    { name: 'Chapter 4: Work, Energy and Power', status: 'locked' },
    { name: 'Chapter 5: System of Particles', status: 'locked' },
  ];

  const roadmapItems = chapters && chapters.length > 0
    ? chapters.map((chap, idx) => {
        let status = 'locked';
        if (idx === 0) status = 'completed';
        else if (idx === 1) status = 'completed';
        else if (idx === 2) status = 'active';
        return { name: chap.name, status };
      })
    : defaultRoadmap;

  return (
    <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-5 h-full relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center border-b pb-3 border-slate-200/20">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Learning Roadmap</h3>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
          {subjectName || 'Physics'}
        </span>
      </div>

      {/* SVG Roadmap nodes path */}
      <div className="space-y-4 relative pl-8 py-2">
        {/* Connecting Vertical Line */}
        <div className="absolute left-3.5 top-5 bottom-5 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 z-0" />

        {roadmapItems.map((item, idx) => {
          let nodeIcon = <Lock className="h-3.5 w-3.5 text-slate-400" />;
          let nodeStyle = 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900';
          let labelStyle = 'text-slate-400 dark:text-slate-500';

          if (item.status === 'completed') {
            nodeIcon = <Check className="h-3.5 w-3.5 text-white" />;
            nodeStyle = 'border-green-500 bg-green-500 shadow-md shadow-green-500/20';
            labelStyle = 'text-slate-700 dark:text-slate-300 font-semibold';
          } else if (item.status === 'active') {
            nodeIcon = <Play className="h-3 w-3 text-white fill-current animate-pulse" />;
            nodeStyle = 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/30 animate-pulse';
            labelStyle = 'text-blue-600 dark:text-blue-400 font-extrabold';
          }

          return (
            <div key={idx} className="relative flex items-center gap-4 z-10">
              {/* Node Circle */}
              <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${nodeStyle}`}>
                {nodeIcon}
              </div>
              {/* Node label */}
              <div className="text-xs">
                <p className={`${labelStyle} truncate max-w-[170px]`}>{item.name}</p>
                {item.status === 'active' && (
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[9px] text-slate-400 leading-relaxed">
        Complete MCQs and watch lectures to advance your learning track.
      </div>
    </div>
  );
};

export default RoadmapWidget;
