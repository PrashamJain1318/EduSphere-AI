import React, { useState, useEffect } from 'react';
import { Download, GraduationCap, Search, FileText } from 'lucide-react';
import api from '../utils/api.js';

const BoardPapers = () => {
  const [papers, setPapers] = useState([]);
  const [boardFilter, setBoardFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/question-papers');
        if (res.data.success) {
          setPapers(res.data.papers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const filteredPapers = papers.filter((p) => {
    const matchBoard = boardFilter ? p.board === boardFilter : true;
    const matchYear = yearFilter ? p.year.toString() === yearFilter : true;
    return matchBoard && matchYear;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 rounded-2xl text-white shadow-md">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Board Exam Question Papers</h1>
          <p className="text-xs text-slate-500">Download previous year board papers and solved solutions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Board</label>
          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
          >
            <option value="">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Filter Year</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* Papers scroll */}
      {loading ? (
        <div className="text-center py-10">Loading question papers...</div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
          No question papers uploaded yet. Admins can upload boards PDF folders using the Admin Dashboard.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <div key={paper._id} className="glass-card p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-500 uppercase">
                  <span>{paper.board}</span>
                  <span>&bull;</span>
                  <span>Year {paper.year}</span>
                  <span>&bull;</span>
                  <span>{paper.subjectId?.name || 'Syllabus Paper'}</span>
                </div>
                <h4 className="font-bold text-sm mt-1">{paper.title}</h4>
              </div>
              <div className="flex gap-2">
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold"
                >
                  <Download className="h-4 w-4" />
                  <span>Question Paper</span>
                </a>
                {paper.solutionPdfUrl && (
                  <a
                    href={paper.solutionPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 bg-green-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Solutions PDF</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardPapers;
