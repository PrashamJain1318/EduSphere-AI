import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateXPAndStreak } from '../store/slices/authSlice.js';
import api from '../utils/api.js';
import {
  Play,
  Video,
  FileText,
  Clock,
  Sparkles,
  Bookmark,
  MessageCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  ThumbsUp,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2
} from 'lucide-react';

const VideoUniverse = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState({ lectures: [], pyqs: [], numericals: [], shorts: [] });
  const [progress, setProgress] = useState({ watchTime: 0, watchPercentage: 0, completed: false });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [notesList, setNotesList] = useState([]);

  // Study Modes
  const [splitScreen, setSplitScreen] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);

  // AI features
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // New Comment / Doubt states
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({}); // { commentId: text }
  const [activeReplyBox, setActiveReplyBox] = useState(null); // commentId
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Watch Time simulation states (since standard iframes block exact play times without API scripts, we mock it or provide a Complete button)
  const [mockWatchTime, setMockWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimer = useRef(null);

  const fetchVideoDetails = async () => {
    try {
      const res = await api.get(`/video/detail/${videoId}`);
      if (res.data.success) {
        setVideo(res.data.video);
        setProgress(res.data.progress);
        setIsBookmarked(res.data.isBookmarked);
        setComments(res.data.comments);

        // Fetch sibling playlist under the same chapter
        const playRes = await api.get(`/video/chapter/${res.data.video.chapterId}`);
        if (playRes.data.success) {
          setPlaylist(playRes.data.grouped);
        }

        // Fetch notes for the chapter
        const notesRes = await api.get(`/student/chapters/${res.data.video.chapterId}/notes`);
        if (notesRes.data.success) {
          setNotesList(notesRes.data.notes);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
    setAiSummary('');
    // Reset watch simulation
    setMockWatchTime(0);
    setIsPlaying(false);
    if (playTimer.current) clearInterval(playTimer.current);
  }, [videoId]);

  // Simulate watch duration updates when playing
  useEffect(() => {
    if (isPlaying) {
      playTimer.current = setInterval(() => {
        setMockWatchTime((prev) => {
          const nextTime = prev + 10; // add 10 seconds of mock watch time
          // Sync to backend progress
          handleUpdateProgress(nextTime);
          return nextTime;
        });
      }, 10000);
    } else {
      if (playTimer.current) clearInterval(playTimer.current);
    }

    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, [isPlaying]);

  const handleUpdateProgress = async (currentTime) => {
    try {
      const durationSecs = 600; // Mock 10 minutes duration for calculations
      const res = await api.post('/video/progress', {
        videoId,
        watchTime: currentTime,
        durationSeconds: durationSecs,
      });
      if (res.data.success) {
        setProgress(res.data.progress);
        if (res.data.xpGained > 0) {
          dispatch(updateXPAndStreak({
            xp: res.data.totalXp,
            badges: res.data.badges
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkCompleted = async () => {
    // Instantly mark completed by setting progress to max
    try {
      const durationSecs = 600;
      const res = await api.post('/video/progress', {
        videoId,
        watchTime: durationSecs,
        durationSeconds: durationSecs,
      });
      if (res.data.success) {
        setProgress(res.data.progress);
        if (res.data.xpGained > 0) {
          dispatch(updateXPAndStreak({
            xp: res.data.totalXp,
            badges: res.data.badges
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await api.post('/video/bookmark/toggle', { videoId });
      if (res.data.success) {
        setIsBookmarked(res.data.isBookmarked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSummary = async () => {
    setAiLoading(true);
    try {
      const res = await api.post('/ai/summarize-notes', {
        notesText: `Video title: ${video.title}. Description: ${video.description}. Review notes summary for Class ${video.class} Subject ${video.subjectId.name}.`
      });
      if (res.data.success) {
        setAiSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
      setAiSummary('Failed to contact Gemini summarizer.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      const res = await api.post('/video/comments', { videoId, comment: newComment });
      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handlePostReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post('/video/comments/reply', { commentId, text });
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.data.comment : c))
        );
        setReplyText((prev) => ({ ...prev, [commentId]: '' }));
        setActiveReplyBox(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      const res = await api.put(`/video/comments/${commentId}/upvote`);
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  upvotes: c.upvotes.includes(user._id)
                    ? c.upvotes.filter((id) => id !== user._id)
                    : [...c.upvotes, user._id],
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinComment = async (commentId) => {
    try {
      const res = await api.put(`/video/comments/${commentId}/pin`);
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, isPinned: res.data.isPinned } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getEmbedUrl = (videoIdStr) => {
    return `https://www.youtube.com/embed/${videoIdStr}`;
  };

  if (!video) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center dark:bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${distractionFree ? 'bg-slate-900 text-white min-h-screen p-4' : 'max-w-7xl mx-auto px-4 py-8 dark:bg-[#0b0f19]'}`}>
      
      {/* 1. Header Toolbar */}
      {!distractionFree && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to curriculum</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border flex items-center space-x-1 text-xs font-bold transition-all ${
                isBookmarked
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved to Watch Later' : 'Save for Later'}</span>
            </button>
            <button
              onClick={() => setDistractionFree(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Distraction-Free Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Distraction free exit bar */}
      {distractionFree && (
        <div className="flex justify-between items-center bg-slate-800 p-3 rounded-2xl mb-4 border border-slate-700">
          <span className="text-xs font-extrabold tracking-wide uppercase text-blue-400">Distraction-Free Study Space</span>
          <button
            onClick={() => setDistractionFree(false)}
            className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Focus Mode</span>
          </button>
        </div>
      )}

      {/* 2. Udemy-Style Main Workspace Grid */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Chapter Playlist accordions */}
        {!distractionFree && (
          <div className="lg:col-span-1 glass-card p-4 rounded-3xl border shadow-sm space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Chapter Playlist</span>
            </h3>

            {/* Accordion categories */}
            <div className="space-y-4">
              {[
                { label: 'Full Lectures', list: playlist.lectures },
                { label: 'PYQ Discussions', list: playlist.pyqs },
                { label: 'Numerical Practice', list: playlist.numericals },
                { label: 'Revision Shorts', list: playlist.shorts },
              ].map((category) => (
                <div key={category.label} className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block border-b pb-1">
                    {category.label} ({category.list.length})
                  </span>
                  <div className="flex flex-col space-y-1">
                    {category.list.map((vid) => (
                      <button
                        key={vid._id}
                        onClick={() => navigate(`/watch/${vid._id}`)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                          vid._id === videoId
                            ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                            : 'border-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span className="truncate max-w-[150px]">{vid.title}</span>
                        <Play className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center/Main Section: Video Player & Study Splits */}
        <div className={distractionFree ? 'lg:col-span-3 space-y-6' : 'lg:col-span-2 space-y-6'}>
          {/* Main Video Frame & Split notes */}
          <div className={`grid gap-4 ${splitScreen ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* YouTube embed */}
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl border bg-black relative">
                <iframe
                  src={getEmbedUrl(video.youtubeVideoId)}
                  title={video.title}
                  className="w-full h-full border-none"
                  allowFullScreen
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                ></iframe>
              </div>

              {/* Player Progress Sync */}
              <div className="flex items-center justify-between text-xs p-3 bg-slate-100/50 dark:bg-slate-850/50 rounded-2xl border">
                <div className="flex items-center space-x-1 text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>Syncing watch position: {progress.watchPercentage}%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkCompleted}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-bold text-[10px]"
                  >
                    Mark 100% Completed
                  </button>
                  <button
                    onClick={() => setSplitScreen(!splitScreen)}
                    className="border px-3 py-1 rounded-lg font-bold text-[10px] flex items-center space-x-1"
                  >
                    <span>Split Notes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Study Mode Notes View */}
            {splitScreen && (
              <div className="glass-card p-5 rounded-3xl border shadow-sm h-full max-h-[380px] overflow-y-auto flex flex-col justify-between">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider">Side-Study Notes</h4>
                  <button onClick={() => setSplitScreen(false)} className="text-xs text-slate-400">Close</button>
                </div>
                <div className="flex-1 py-4 text-center text-slate-400 flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 text-red-400 mb-2 animate-bounce" />
                  <p className="text-xs font-semibold leading-relaxed">
                    {notesList[0]?.title || 'Chapter Study Notes PDF'}
                  </p>
                  <a
                    href={notesList[0]?.pdfUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow"
                  >
                    Open PDF Document
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Video metadata information details */}
          <div className="glass-card p-5 rounded-3xl border shadow-sm space-y-3">
            <h2 className="text-base font-extrabold leading-snug">{video.title}</h2>
            <p className="text-xs text-slate-500 leading-normal">{video.description}</p>
          </div>

          {/* Sub-video Doubt forum comment list */}
          <div className="glass-card p-5 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <MessageCircle className="h-4.5 w-4.5 text-blue-500" />
              <span>Ask Doubt & Comments</span>
            </h3>

            {/* Ask Doubt comment form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask your doubt regarding this concept..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={commentSubmitting || !newComment.trim()}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl"
              >
                Post Doubt
              </button>
            </form>

            {/* Doubt threads comments scroll */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar">
              {comments.map((comm) => (
                <div key={comm._id} className="p-4 bg-slate-100/30 dark:bg-slate-850/30 rounded-2xl border space-y-3 relative">
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <span className="text-slate-800 dark:text-slate-100">{comm.userId?.name}</span>
                      <span className="text-slate-400 font-normal">({comm.userId?.role})</span>
                      {comm.isPinned && (
                        <span className="bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded">Pinned Solution</span>
                      )}
                    </div>
                    {/* Pin comment toggle for teacher/admin */}
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                      <button
                        onClick={() => handlePinComment(comm._id)}
                        className="text-[9px] font-extrabold text-blue-500 hover:underline"
                      >
                        {comm.isPinned ? 'Unpin' : 'Pin Solution'}
                      </button>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350">{comm.comment}</p>

                  <div className="flex justify-between items-center text-[9px] pt-1">
                    <button
                      onClick={() => handleUpvoteComment(comm._id)}
                      className={`flex items-center space-x-1 border px-2 py-0.5 rounded ${
                        comm.upvotes?.includes(user?._id) ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{comm.upvotes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => setActiveReplyBox(activeReplyBox === comm._id ? null : comm._id)}
                      className="text-blue-500 font-semibold"
                    >
                      Reply ({comm.replies?.length || 0})
                    </button>
                  </div>

                  {/* Replies List log */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="pl-6 space-y-2.5 pt-2.5 border-t border-slate-200/10">
                      {comm.replies.map((rep, rIdx) => (
                        <div key={rIdx} className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-[9px] font-bold text-slate-500">
                            <span>{rep.userId?.name || 'Classmate'}</span>
                            <span>&bull;</span>
                            <span>{rep.userId?.role || 'Student'}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/40 p-2 rounded-xl border">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active reply input */}
                  {activeReplyBox === comm._id && (
                    <div className="flex gap-2 pt-2.5 border-t border-slate-200/10">
                      <input
                        type="text"
                        value={replyText[comm._id] || ''}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [comm._id]: e.target.value }))}
                        placeholder="Write a response..."
                        className="flex-1 bg-white border p-2 rounded-xl text-[11px]"
                      />
                      <button
                        onClick={() => handlePostReply(comm._id)}
                        className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Chapter Notes, AI summaries & Progress */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* AI summaries button & display */}
          <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-sm">AI Video Summarizer</h3>
            </div>
            <p className="text-xs text-slate-500">Generate formula lists and definition sheets from this lecture automatically.</p>
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1"
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Generate summary sheet</span>
            </button>

            {aiSummary && (
              <div className="text-[11px] leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-850/50 p-3.5 rounded-xl border max-h-[300px] overflow-y-auto scrollbar mt-3">
                {aiSummary}
              </div>
            )}
          </div>

          {/* Quick links to generate AI Quiz */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>AI Custom Quiz Maker</span>
            </h3>
            <p className="text-xs text-blue-200 leading-normal">
              Test your knowledge! Create a 5-question mock sheet from this chapter notes instantly.
            </p>
            <Link
              to="/ai-assistant"
              className="inline-block text-xs font-bold bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-center"
            >
              Launch AI Quiz tab
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoUniverse;
