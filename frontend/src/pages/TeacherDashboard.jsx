import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, MessageSquare, PlusCircle, LayoutDashboard, HelpCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api.js';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalNotes: 0,
    totalVideos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Reuse admin analytics or basic counts
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Teacher Portal Active</span>
          </div>
          <h1 className="text-3xl font-extrabold">Welcome, Educator!</h1>
          <p className="text-blue-100 text-sm max-w-md mt-1">
            Review student counts, assist candidates in the doubts discussion thread, and write course syllabus materials.
          </p>
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
          <div className="text-xs text-slate-500 mt-1">Platform Students</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalNotes}</div>
          <div className="text-xs text-slate-500 mt-1">Academic Notes</div>
        </div>
        <div className="glass-card p-5 rounded-2xl border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalVideos}</div>
          <div className="text-xs text-slate-500 mt-1">Lectures Hosted</div>
        </div>
      </div>

      {/* Teacher Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Forum response */}
        <div className="glass-card p-6 rounded-3xl border space-y-4">
          <HelpCircle className="h-8 w-8 text-blue-500" />
          <h3 className="font-bold text-sm">Review & Verify Doubts</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Answer questions posted by Class 10 and 12 board candidates. Your responses carry a "Verified Teacher" badge overlay to establish credibility.
          </p>
          <Link
            to="/forum"
            className="inline-flex items-center space-x-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md"
          >
            <span>Launch Discussion Forum</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Content redirect */}
        <div className="glass-card p-6 rounded-3xl border space-y-4">
          <PlusCircle className="h-8 w-8 text-indigo-500" />
          <h3 className="font-bold text-sm">Upload Study Material</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Teachers can upload chapter notes PDFs, video lecture links, and board exam solutions by requesting admin credentials or logging content upload forms.
          </p>
          <Link
            to="/forum"
            className="inline-flex items-center space-x-1 text-xs font-semibold border text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl"
          >
            <span>Review Forum Doubts</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
