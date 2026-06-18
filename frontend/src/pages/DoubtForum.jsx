import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HelpCircle, Search, MessageSquare, ThumbsUp, CheckCircle, PlusCircle, User, Loader2 } from 'lucide-react';
import api from '../utils/api.js';

const DoubtForum = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [doubts, setDoubts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Ask Doubt states
  const [askOpen, setAskOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);

  // Selected Doubt (detail view overlay)
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doubts?search=${search}`);
      if (res.data.success) {
        setDoubts(res.data.doubts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [search]);

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmittingDoubt(true);
    try {
      const res = await api.post('/doubts', { title, description });
      if (res.data.success) {
        setDoubts((prev) => [res.data.doubt, ...prev]);
        setAskOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDoubt(false);
    }
  };

  const handleUpvoteDoubt = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) return alert('Please login to upvote doubts');
    try {
      const res = await api.put(`/doubts/${id}/upvote`);
      if (res.data.success) {
        // Update local state upvotes count
        setDoubts((prev) =>
          prev.map((d) => (d._id === id ? { ...d, upvotesCount: res.data.upvotesCount } : d))
        );
        if (selectedDoubt && selectedDoubt._id === id) {
          setSelectedDoubt((prev) => ({
            ...prev,
            upvotes: res.data.isUpvoted
              ? [...prev.upvotes, user._id]
              : prev.upvotes.filter((uid) => uid !== user._id),
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerDoubt = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedDoubt) return;
    setSubmittingAnswer(true);
    try {
      const res = await api.post(`/doubts/${selectedDoubt._id}/answers`, { text: answerText });
      if (res.data.success) {
        setSelectedDoubt(res.data.doubt);
        setAnswerText('');
        // Sync back to main list
        setDoubts((prev) => prev.map((d) => (d._id === selectedDoubt._id ? res.data.doubt : d)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleUpvoteAnswer = async (doubtId, answerId) => {
    if (!isAuthenticated) return alert('Please login to upvote answers');
    try {
      const res = await api.put(`/doubts/${doubtId}/answers/${answerId}/upvote`);
      if (res.data.success) {
        // Sync selected doubt answers upvotes
        setSelectedDoubt((prev) => {
          const updatedAnswers = prev.answers.map((ans) => {
            if (ans._id === answerId) {
              return {
                ...ans,
                upvotes: res.data.isUpvoted
                  ? [...ans.upvotes, user._id]
                  : ans.upvotes.filter((uid) => uid !== user._id),
              };
            }
            return ans;
          });
          return { ...prev, answers: updatedAnswers };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-md"><HelpCircle className="h-6 w-6" /></div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Doubt Discussion Forum</h1>
            <p className="text-xs text-slate-500">Ask classmates and teachers for quick conceptual support</p>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setAskOpen(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Ask a Doubt</span>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left columns list of doubts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doubts title or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-850 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Doubts scroll log */}
          {loading && doubts.length === 0 ? (
            <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" /></div>
          ) : doubts.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
              No doubts posted matching this query. Be the first to ask!
            </div>
          ) : (
            <div className="space-y-4">
              {doubts.map((doubt) => (
                <div
                  key={doubt._id}
                  onClick={() => setSelectedDoubt(doubt)}
                  className="glass-card p-5 rounded-2xl border hover:border-blue-500/30 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{doubt.title}</h3>
                    <button
                      onClick={(e) => handleUpvoteDoubt(e, doubt._id)}
                      className={`flex items-center space-x-1 text-[10px] font-bold border px-2.5 py-1 rounded-lg transition-colors ${
                        user && doubt.upvotes?.includes(user._id)
                          ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{doubt.upvotesCount !== undefined ? doubt.upvotesCount : doubt.upvotes?.length || 0}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{doubt.description}</p>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-200/10">
                    <span className="flex items-center gap-1 font-semibold text-slate-500">
                      <User className="h-3 w-3" />
                      <span>{doubt.authorId?.name || 'Candidate'} ({doubt.authorId?.role || 'Student'})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                      <span>{doubt.answers?.length || 0} Answers</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column Thread details */}
        <div className="lg:col-span-1">
          {selectedDoubt ? (
            <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-6 sticky top-24 max-h-[calc(100vh-140px)] flex flex-col">
              <div className="flex justify-between items-start border-b pb-3 border-slate-200/20">
                <span className="text-[10px] font-bold uppercase text-blue-500">Thread Review</span>
                <button onClick={() => setSelectedDoubt(null)} className="text-[10px] text-slate-500 hover:text-slate-700">Close</button>
              </div>

              {/* Title & description */}
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar">
                <h3 className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-200">{selectedDoubt.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-100/30 dark:bg-slate-850/30 p-3 rounded-xl border">
                  {selectedDoubt.description}
                </p>

                {/* Answers lists */}
                <div className="space-y-4 pt-4 border-t border-slate-200/10">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solutions ({selectedDoubt.answers?.length || 0})</h4>
                  {selectedDoubt.answers?.length === 0 ? (
                    <p className="text-[11px] text-slate-400">No solutions posted yet. Write one below!</p>
                  ) : (
                    selectedDoubt.answers.map((ans) => (
                      <div key={ans._id} className="p-3 bg-slate-100/50 dark:bg-slate-850/50 rounded-xl space-y-2 border border-slate-200/10">
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span className="font-semibold">{ans.authorId?.name || 'Classmate'}</span>
                          {ans.isTeacherVerified && (
                            <span className="flex items-center text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                              <CheckCircle className="h-3 w-3 mr-0.5" />
                              <span>Verified Teacher</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{ans.text}</p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleUpvoteAnswer(selectedDoubt._id, ans._id)}
                            className={`flex items-center space-x-1 text-[9px] font-bold border px-2 py-0.5 rounded transition-all ${
                              user && ans.upvotes?.includes(user._id)
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{ans.upvotes?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Answer input */}
              {isAuthenticated ? (
                <form onSubmit={handleAnswerDoubt} className="space-y-3 pt-3 border-t border-slate-200/20">
                  <textarea
                    rows="3"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Provide a conceptual solution..."
                    required
                    disabled={submittingAnswer}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submittingAnswer || !answerText.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs"
                  >
                    {submittingAnswer ? 'Posting...' : 'Post Solution'}
                  </button>
                </form>
              ) : (
                <p className="text-[10px] text-slate-400 text-center">Login to post a solution.</p>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 rounded-3xl border shadow-sm text-center text-slate-400 py-16 hidden lg:block">
              <MessageSquare className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-xs">No doubt selected</h3>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-1">Select a query from the board to examine discussion threads and write answers.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ask Doubt Modal Dialog */}
      {askOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card p-6 rounded-3xl border shadow-xl bg-white dark:bg-[#0f172a] space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-sm">Ask a New Doubt</h3>
              <button onClick={() => setAskOpen(false)} className="text-xs text-slate-500">&times;</button>
            </div>
            <form onSubmit={handleAskDoubt} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 uppercase tracking-widest mb-1.5">Title / Subject Summary</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Help needed in solving optics focal length equations"
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-500 uppercase tracking-widest mb-1.5">Description details</label>
                <textarea
                  rows="4"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify values, question details, or context principles..."
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submittingDoubt}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex-1 text-xs"
                >
                  {submittingDoubt ? 'Submitting...' : 'Post Doubt'}
                </button>
                <button
                  type="button"
                  onClick={() => setAskOpen(false)}
                  className="border py-2.5 rounded-xl flex-1 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubtForum;
