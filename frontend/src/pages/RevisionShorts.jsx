import React, { useState, useEffect } from 'react';
import { Flame, Bookmark, ThumbsUp, Sparkles, Star, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../utils/api.js';

const RevisionShorts = () => {
  const [activeCategory, setActiveCategory] = useState('formula'); // formula, notes, concepts, tricks
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction Mock States
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [activeIdx, setActiveIdx] = useState(0);

  const mockShortsList = {
    formula: [
      { id: '1', title: 'Electrostatic Potential Equation', desc: 'V = W / q. Potential is work done per unit charge.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: '2', title: 'Ohm’s Law Formula Breakdown', desc: 'V = IR. Voltage, Current, and Resistance proportion rules.', url: 'https://www.youtube.com/embed/g-5W5v-3Y78' }
    ],
    notes: [
      { id: '3', title: 'Carbon Compound Nomenclature', desc: 'Prefixes (meth, eth, prop, but) and functional groups rules summary.', url: 'https://www.youtube.com/embed/JmC-vH8g12A' }
    ],
    concepts: [
      { id: '4', title: 'Redox Reactions Oxidizing Agents', desc: 'Gain of oxygen vs loss of hydrogen conceptual checks.', url: 'https://www.youtube.com/embed/2Juem0lc5gc' }
    ],
    tricks: [
      { id: '5', title: 'Equation balancing matrix trick', desc: 'Balance standard equations in under 30 seconds.', url: 'https://www.youtube.com/embed/g-5W5v-3Y78' }
    ]
  };

  useEffect(() => {
    // Try to load subjects and fetch actual shorts or use mock category boards
    const loadShorts = async () => {
      setLoading(true);
      setShorts(mockShortsList[activeCategory] || mockShortsList.formula);
      setActiveIdx(0);
      setLoading(false);
    };
    loadShorts();
  }, [activeCategory]);

  const handleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2.5 rounded-2xl text-white shadow-md">
          <Flame className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Revision Shorts</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>1-Minute Concept Summaries</span>
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar">
        {[
          { id: 'formula', label: 'Formulas' },
          { id: 'notes', label: 'Quick Notes' },
          { id: 'concepts', label: 'Concepts' },
          { id: 'tricks', label: 'Exam Tricks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/20'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reels Slider Container */}
      {shorts.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
          No revision shorts listed for this category yet.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border bg-black rounded-3xl overflow-hidden h-[500px] shadow-2xl flex flex-col justify-end text-white">
            {/* Embed video player */}
            <iframe
              src={shorts[activeIdx].url}
              title={shorts[activeIdx].title}
              className="absolute inset-0 w-full h-full border-none z-0"
              allowFullScreen
            ></iframe>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-10" />

            {/* Interactions Overlays */}
            <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-4 text-center">
              {/* Like */}
              <button
                onClick={() => handleLike(shorts[activeIdx].id)}
                className={`p-2.5 rounded-full backdrop-blur-md shadow border ${
                  liked[shorts[activeIdx].id] ? 'bg-red-500 text-white border-red-500' : 'bg-black/40 text-white border-white/20'
                }`}
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
              {/* Bookmark */}
              <button
                onClick={() => handleBookmark(shorts[activeIdx].id)}
                className={`p-2.5 rounded-full backdrop-blur-md shadow border ${
                  bookmarked[shorts[activeIdx].id] ? 'bg-amber-500 text-white border-amber-500' : 'bg-black/40 text-white border-white/20'
                }`}
              >
                <Bookmark className="h-5 w-5 fill-current" />
              </button>
            </div>

            {/* Video description */}
            <div className="p-6 space-y-2 relative z-20">
              <span className="text-[9px] font-extrabold uppercase bg-red-500 text-white px-2 py-0.5 rounded-full inline-block">
                Concept short
              </span>
              <h4 className="font-extrabold text-sm leading-snug">{shorts[activeIdx].title}</h4>
              <p className="text-[10px] text-slate-300 leading-relaxed">{shorts[activeIdx].desc}</p>
            </div>
          </div>

          {/* Swipe controls */}
          <div className="flex justify-between items-center px-4">
            <button
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeIdx === 0}
              className="flex items-center space-x-1 border px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              <ChevronUp className="h-4 w-4" />
              <span>Swipe Up</span>
            </button>
            <button
              onClick={() => setActiveIdx((prev) => Math.min(shorts.length - 1, prev + 1))}
              disabled={activeIdx === shorts.length - 1}
              className="flex items-center space-x-1 border px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              <span>Swipe Down</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionShorts;
