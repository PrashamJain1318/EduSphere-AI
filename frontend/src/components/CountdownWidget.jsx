import React, { useState, useEffect } from 'react';
import { Calendar, Hourglass } from 'lucide-react';

const CountdownWidget = () => {
  // Target date: CBSE Board Exams starting March 1, 2027
  const targetDate = new Date('2027-03-01T09:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-6 rounded-3xl border shadow-sm flex flex-col justify-between gap-4 h-full relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />

      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><Calendar className="h-4.5 w-4.5" /></div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Board Exam Countdown</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-full">
            CBSE & ICSE Boards 2027
          </span>
          <span className="text-xs font-bold text-slate-400">March 1, 2027</span>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-2.5 rounded-2xl border">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{timeLeft.days}</div>
            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Days</div>
          </div>
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-2.5 rounded-2xl border">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{timeLeft.hours}</div>
            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Hours</div>
          </div>
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-2.5 rounded-2xl border">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{timeLeft.minutes}</div>
            <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Mins</div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-200/20 pt-3">
        <Hourglass className="h-3.5 w-3.5 text-blue-500 animate-spin" />
        <span>Maintain consistency in daily mock tests to be fully prepared!</span>
      </div>
    </div>
  );
};

export default CountdownWidget;
