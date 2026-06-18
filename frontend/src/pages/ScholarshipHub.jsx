import React, { useState } from 'react';
import { Award, Search, BookOpen, Clock, ArrowRight, Star } from 'lucide-react';

const ScholarshipHub = () => {
  const [classFilter, setClassFilter] = useState('');
  const [streamFilter, setStreamFilter] = useState('');

  const scholarships = [
    {
      title: 'National Talent Search Examination (NTSE)',
      type: 'Government Olympiad',
      class: '10',
      stream: 'All',
      reward: '₹1,250 - ₹2,000 / month stipend',
      deadline: 'October 15, 2026',
      eligibility: 'Class 10 students with 60%+ in Class 9 exams.',
      description: 'National level scholarship program in India to identify and nurture talented students.',
    },
    {
      title: 'Kishore Vaigyanik Protsahan Yojana (KVPY)',
      type: 'Science Fellowship',
      class: '12',
      stream: 'Science',
      reward: '₹5,000 / month + ₹20,000 annual grant',
      deadline: 'September 30, 2026',
      eligibility: 'Class 12 Science stream candidates targeting basic sciences.',
      description: 'National program of fellowship in basic sciences initiated and funded by Department of Science and Technology.',
    },
    {
      title: 'INSPIRE Scholarship Scheme',
      type: 'Higher Education Scholarship',
      class: '12',
      stream: 'Science',
      reward: '₹80,000 / annually for 5 years',
      deadline: 'November 25, 2026',
      eligibility: 'Top 1% of Class 12 board scorers pursuing Natural/Basic Sciences.',
      description: 'Innovation in Science Pursuit for Inspired Research (INSPIRE) scheme to attract talent to science.',
    },
    {
      title: 'Central Sector Scheme of Scholarship (CSSS)',
      type: 'Higher Education Board Scholarship',
      class: '12',
      stream: 'All',
      reward: '₹12,000 - ₹20,000 / annually',
      deadline: 'December 15, 2026',
      eligibility: 'Class 12 pass-outs in top 80th percentile of respective board stream.',
      description: 'Central sector scheme providing financial assistance to meritorious students from low-income families.',
    },
    {
      title: 'National Science Olympiad (NSO)',
      type: 'Olympiad Competition',
      class: '10',
      stream: 'All',
      reward: 'Cash prizes + gold medals + international exposure',
      deadline: 'August 31, 2026',
      eligibility: 'All Class 10 candidates enrolled in CBSE/ICSE schools.',
      description: 'Science competition for students to evaluate their conceptual analytical thinking skills.',
    },
  ];

  const filteredList = scholarships.filter((item) => {
    const matchClass = classFilter ? item.class === classFilter : true;
    const matchStream = streamFilter ? item.stream === 'All' || item.stream === streamFilter : true;
    return matchClass && matchStream;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2.5 rounded-2xl text-white shadow-md">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Scholarship & Olympiads Hub</h1>
          <p className="text-xs text-slate-500">Explore national competitions and financial stipend programs</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Class</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs font-semibold focus:outline-none"
          >
            <option value="">All Classes</option>
            <option value="10">Class 10</option>
            <option value="12">Class 12</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Stream</label>
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs font-semibold focus:outline-none"
          >
            <option value="">All Streams</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Humanities">Humanities</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredList.length === 0 ? (
          <div className="col-span-2 text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
            No scholarships found for these filters.
          </div>
        ) : (
          filteredList.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border flex flex-col justify-between hover:border-purple-500/30 transition-all tilt-card h-64">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold uppercase text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full">
                    {item.type}
                  </span>
                  <div className="flex items-center text-amber-500 text-[10px] font-bold">
                    <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
                    <span>Active</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-3.5 leading-snug">{item.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="space-y-2.5 border-t border-slate-200/15 pt-3 mt-4 text-[10px]">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Reward: <strong>{item.reward}</strong></span>
                  <span>Deadline: <strong>{item.deadline}</strong></span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="truncate max-w-[200px]">Eligibility: {item.eligibility}</span>
                  <button className="text-purple-500 hover:text-purple-600 flex items-center space-x-0.5 font-bold">
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScholarshipHub;
