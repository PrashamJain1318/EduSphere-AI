import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, Loader2, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import api from '../utils/api.js';

const AIPlanner = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setFetchingSubjects(true);
        const res = await api.get('/student/subjects');
        if (res.data.success) {
          setSubjects(res.data.subjects);
          // Auto select all subjects by default
          setSelectedSubjects(res.data.subjects.map((s) => s.name));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectToggle = (name) => {
    setSelectedSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!examDate || selectedSubjects.length === 0) return;

    setLoading(true);
    try {
      const res = await api.post('/ai/plan', {
        examDate,
        subjects: selectedSubjects,
        hoursPerDay,
      });
      if (res.data.success) {
        setGeneratedPlan(res.data.plan);
      }
    } catch (err) {
      console.error(err);
      setGeneratedPlan('An error occurred during planner generation. Please review your backend API setups.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Study Planner</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Generate custom schedules using Gemini AI</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left column Form parameters */}
        <form onSubmit={handleGeneratePlan} className="glass-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-sm font-bold">Planner Inputs</h3>

          {/* Exam Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Exam Date</label>
            <input
              type="date"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Available hours */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Study Capacity (Hours/Day)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="number"
                min="1"
                max="16"
                required
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Target subjects selection */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Subjects</label>
            {fetchingSubjects ? (
              <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Loading stream subjects...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <button
                    type="button"
                    key={sub._id}
                    onClick={() => handleSubjectToggle(sub.name)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSubjects.includes(sub.name)
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-55'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {selectedSubjects.includes(sub.name) && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading || selectedSubjects.length === 0 || !examDate}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-md text-xs"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            <span>Generate Study Plan</span>
          </button>
        </form>

        {/* Right column Markdown Plan display */}
        <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border shadow-sm min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-4 border-b pb-3 border-slate-200/20">Your Personalized Study Plan</h2>
          {generatedPlan ? (
            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200 flex-1 overflow-y-auto max-h-[500px] pr-2">
              {generatedPlan}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-xs max-w-sm">
                Enter your exam date, select subjects, and click generate to formulate your daily study calendars and revision strategy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
