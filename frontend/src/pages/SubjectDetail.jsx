import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateXPAndStreak } from '../store/slices/authSlice.js';
import api from '../utils/api.js';
import { BookOpen, Video, FileQuestion, GraduationCap, Flame, Play, Download, Search, FileText, ChevronRight, CheckCircle, Bookmark } from 'lucide-react';

const EnglishSectionCard = ({ title, emoji, chaptersCount, compPercent, onClick, gradient, border, glow, progressColor }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotateX(-y / (box.height / 2) * 8);
    setRotateY(x / (box.width / 2) * 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (compPercent / 100) * circumference;

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`relative glass-card p-6 rounded-3xl border bg-gradient-to-br ${gradient} ${border} ${glow} cursor-pointer transition-all duration-200 flex flex-col justify-between h-48 overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <span className="text-3xl block">{emoji}</span>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-2">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{chaptersCount} Chapters</p>
        </div>
        
        <div className="relative flex items-center justify-center w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-slate-200/50 dark:text-slate-800/80 stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-current"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                color: progressColor,
                transition: 'stroke-dashoffset 0.5s ease-in-out'
              }}
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">
            {compPercent}%
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t pt-4 border-slate-200/45 dark:border-slate-800/45 relative z-10">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Curriculum Section</span>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>Enter Section</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </motion.div>
  );
};

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // notes, videos, pyqs, boardPapers, shorts
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Material content states
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [boardPapers, setBoardPapers] = useState([]);
  const [shorts, setShorts] = useState([]);

  // Material filters / search
  const [searchQuery, setSearchQuery] = useState('');
  const [paperBoardFilter, setPaperBoardFilter] = useState('');
  const [paperYearFilter, setPaperYearFilter] = useState('');

  // Inline PDF Viewer state
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [currentPdfTitle, setCurrentPdfTitle] = useState('');

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        // Fetch subject details (from list of subjects)
        const subListRes = await api.get('/student/subjects');
        if (subListRes.data.success) {
          const currentSub = subListRes.data.subjects.find((s) => s._id === subjectId);
          setSubject(currentSub);
        }

        // Fetch chapters
        const chapRes = await api.get(`/student/subjects/${subjectId}/chapters`);
        if (chapRes.data.success) {
          setChapters(chapRes.data.chapters);
          setSelectedChapter(null);
        }

        // Fetch user progress
        const progRes = await api.get('/student/progress');
        if (progRes.data.success) {
          setProgress(progRes.data.progress);
        }
      } catch (err) {
        console.error('Error fetching subject detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [subjectId]);

  // Load Chapter Specific materials when chapter changes or tab changes
  useEffect(() => {
    if (!selectedChapter) return;

    const fetchChapterMaterials = async () => {
      try {
        if (activeTab === 'notes') {
          const res = await api.get(`/student/chapters/${selectedChapter._id}/notes`);
          if (res.data.success) setNotes(res.data.notes);
        } else if (activeTab === 'videos') {
          const res = await api.get(`/student/chapters/${selectedChapter._id}/videos`);
          if (res.data.success) setVideos(res.data.videos);
        } else if (activeTab === 'pyqs') {
          const res = await api.get(`/student/chapters/${selectedChapter._id}/pyqs`);
          if (res.data.success) setPyqs(res.data.pyqs);
        } else if (activeTab === 'boardPapers') {
          const res = await api.get(`/student/chapters/${selectedChapter._id}/papers`);
          if (res.data.success) setBoardPapers(res.data.papers);
        } else if (activeTab === 'shorts') {
          const res = await api.get(`/student/chapters/${selectedChapter._id}/shorts`);
          if (res.data.success) setShorts(res.data.shorts);
        }
      } catch (err) {
        console.error('Error loading chapter materials:', err);
      }
    };

    fetchChapterMaterials();
  }, [selectedChapter, activeTab]);

  const handleNotesRead = async (noteId) => {
    try {
      const res = await api.post('/student/progress', { noteId });
      if (res.data.success) {
        dispatch(updateXPAndStreak({
          xp: res.data.totalXp,
          badges: res.data.badges
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (videoId, currentStatus) => {
    try {
      const res = await api.post('/video/bookmark/toggle', { videoId });
      if (res.data.success) {
        setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isBookmarked: !currentStatus } : v));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkCompleted = async (videoId, currentStatus) => {
    if (currentStatus) return;
    try {
      const durationSecs = 600;
      const res = await api.post('/video/progress', {
        videoId,
        watchTime: durationSecs,
        durationSeconds: durationSecs,
      });
      if (res.data.success) {
        setVideos(prev => prev.map(v => v._id === videoId ? {
          ...v,
          progress: {
            watchTime: durationSecs,
            watchPercentage: 100,
            completed: true
          }
        } : v));
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

  const getEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const getChapterEmoji = (chapterName) => {
    const name = chapterName.toLowerCase();
    // History
    if (name.includes('rise of nationalism') || name.includes('nationalism in europe')) return '📜';
    if (name.includes('nationalism in india')) return '🇮🇳';
    if (name.includes('making of a global world') || name.includes('making of global world')) return '🌍';
    if (name.includes('age of industrialisation') || name.includes('age of industrialization')) return '🏭';
    if (name.includes('print culture')) return '📰';
    
    // Civics
    if (name.includes('power sharing')) return '📖';
    if (name.includes('federalism')) return '📖';
    if (name.includes('gender')) return '📖';
    if (name.includes('political parties')) return '📖';
    if (name.includes('outcomes of democracy')) return '📖';

    // Geography
    if (name.includes('resources and development')) return '🌍';
    if (name.includes('forest and wildlife')) return '🌳';
    if (name.includes('water resources')) return '💧';
    if (name.includes('agriculture')) return '🌾';
    if (name.includes('minerals and energy')) return '⛏️';
    if (name.includes('manufacturing industries')) return '🏭';
    if (name.includes('lifelines of national')) return '🚆';

    // Economics
    if (name.includes('sectors of the indian economy') || name.includes('sectors of indian economy')) return '🏢';
    if (name.includes('money and credit')) return '💳';
    if (name.includes('globalisation') || name.includes('globalization')) return '🌐';
    if (name.includes('consumer rights')) return '🛡️';
    if (name.includes('development')) return '📈'; // Checked after resources and development to avoid clash

    return '📖';
  };

  const getChapterCompletionPercentage = (chapId) => {
    if (!progress) return 0;
    const isCompleted = progress.completedChapters?.some(pc => (pc._id || pc) === chapId);
    if (isCompleted) return 100;
    
    let percent = 0;
    const hasNote = progress.notesRead?.some(n => (n.chapterId?._id || n.chapterId || n._id || n) === chapId);
    const hasVideo = progress.videosWatched?.some(v => (v.chapterId?._id || v.chapterId || v._id || v) === chapId);
    if (hasNote) percent += 50;
    if (hasVideo) percent += 50;
    return percent;
  };

  const getSectionCompletionPercentage = (sectionName) => {
    const sectionChapters = chapters.filter(chap => chap.section === sectionName);
    if (sectionChapters.length === 0) return 0;
    
    let totalPercent = 0;
    sectionChapters.forEach(chap => {
      totalPercent += getChapterCompletionPercentage(chap._id);
    });
    return Math.round(totalPercent / sectionChapters.length);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center dark:bg-[#0b0f19]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter handlers
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPYQs = pyqs.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPapers = boardPapers.filter((p) => {
    const matchBoard = paperBoardFilter ? p.board === paperBoardFilter : true;
    const matchYear = paperYearFilter ? p.year.toString() === paperYearFilter : true;
    return matchBoard && matchYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{subject?.code || 'Boards Core'}</span>
          <h1 className="text-3xl font-extrabold mt-1">{subject?.name}</h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-slate-400 hover:text-white"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {selectedChapter === null ? (
        /* CHAPTERS GRID OR SECTIONS SELECTION */
        subject?.name?.toLowerCase() === 'english' && selectedSection === null ? (
          /* ENGLISH SECTIONS GRID */
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">📚 Choose English Curriculum Section</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select a major section below to explore chapters, poems, and their assigned materials.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnglishSectionCard
                title="First Flight"
                emoji="📘"
                chaptersCount={chapters.filter(c => c.section === 'First Flight').length}
                compPercent={getSectionCompletionPercentage('First Flight')}
                onClick={() => setSelectedSection('First Flight')}
                gradient="from-blue-500/10 to-indigo-500/10"
                border="hover:border-blue-500/50"
                glow="shadow-blue-500/5"
                progressColor="#3b82f6"
              />
              <EnglishSectionCard
                title="Poems"
                emoji="📝"
                chaptersCount={chapters.filter(c => c.section === 'Poems').length}
                compPercent={getSectionCompletionPercentage('Poems')}
                onClick={() => setSelectedSection('Poems')}
                gradient="from-purple-500/10 to-pink-500/10"
                border="hover:border-purple-500/50"
                glow="shadow-purple-500/5"
                progressColor="#a855f7"
              />
              <EnglishSectionCard
                title="Footprints Without Feet"
                emoji="📚"
                chaptersCount={chapters.filter(c => c.section === 'Footprints Without Feet').length}
                compPercent={getSectionCompletionPercentage('Footprints Without Feet')}
                onClick={() => setSelectedSection('Footprints Without Feet')}
                gradient="from-emerald-500/10 to-teal-500/10"
                border="hover:border-emerald-500/50"
                glow="shadow-emerald-500/5"
                progressColor="#10b981"
              />
            </div>
          </div>
        ) : (
          /* CHAPTERS LIST (SECTION OR REGULAR) */
          <div className="space-y-6">
            {subject?.name?.toLowerCase() === 'english' && (
              <button
                onClick={() => setSelectedSection(null)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-full w-fit shadow-sm border border-slate-200/20"
              >
                <span>&larr; Back to Sections</span>
              </button>
            )}
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {selectedSection ? `📖 ${selectedSection} Chapters` : '📖 Select a Chapter to Begin Learning'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a chapter card below to view its specific notes, video lectures, PYQs, board papers, and revision shorts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters
                .filter(chap => subject?.name?.toLowerCase() !== 'english' || chap.section === selectedSection)
                .map((chap) => {
                  const compPercent = getChapterCompletionPercentage(chap._id);
                  return (
                    <motion.div
                      key={chap._id}
                      onClick={() => {
                        setSelectedChapter(chap);
                        setActiveTab('videos'); // Automatically show the video lectures tab
                        setCurrentPdfUrl(null);
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="glass-card cursor-pointer p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative group overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{getChapterEmoji(chap.name)}</span>
                          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">Chapter {chap.order}</span>
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-105 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                            {chap.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                            Access notes, video lectures, solved chapter PYQs, previous year papers, and revision shorts.
                          </p>
                        </div>

                        {/* Completion Percentage Progress Bar */}
                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-400">Chapter Progress</span>
                            <span className="text-slate-600 dark:text-slate-300">{compPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${compPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t pt-4 border-slate-200/45 dark:border-slate-800/45 relative z-10">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Fully Seeded</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>Start Learning</span>
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )
      ) : (
        /* CHAPTER DASHBOARD VIEW */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => setSelectedChapter(null)}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-650 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 rounded-full w-fit shadow-sm border border-slate-200/20"
            >
              <span>&larr; Back to Chapters</span>
            </button>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md">
                Chapter {selectedChapter.order}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1.5">{selectedChapter.name} Dashboard</h2>
            </div>
          </div>

          <div className="space-y-6">
            {/* Custom Tabs */}
            <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
              {[
                { id: 'notes', label: 'Study Notes', icon: <BookOpen className="h-4 w-4" /> },
                { id: 'videos', label: 'Video Lectures', icon: <Video className="h-4 w-4" /> },
                { id: 'pyqs', label: 'Chapter PYQs', icon: <FileQuestion className="h-4 w-4" /> },
                { id: 'boardPapers', label: 'Previous Year Papers', icon: <GraduationCap className="h-4 w-4" /> },
                { id: 'shorts', label: 'Revision Shorts', icon: <Flame className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPdfUrl(null);
                    setSearchQuery('');
                  }}
                  className={`flex items-center space-x-1.5 pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search bar helper for Notes, PYQs, Papers */}
            {['notes', 'pyqs', 'boardPapers'].includes(activeTab) && (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white/40 dark:bg-slate-800/40 rounded-xl border text-xs focus:outline-none"
                />
              </div>
            )}

            {/* Section 1: Notes List */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* PDF Viewer component */}
                {currentPdfUrl && (
                  <div className="glass-card p-4 rounded-2xl border border-blue-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200/20">
                      <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentPdfTitle}</h3>
                      <button
                        onClick={() => setCurrentPdfUrl(null)}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Close Viewer
                      </button>
                    </div>
                    {/* Mockup PDF Viewer showing a beautiful readable frame with download links */}
                    <div className="w-full h-[450px] bg-slate-105 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center p-6 border text-center">
                      <FileText className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
                      <h4 className="font-bold text-sm mb-2">{currentPdfTitle}</h4>
                      <p className="text-xs text-slate-500 max-w-xs mb-6">
                        PDF preview loader. Download the PDF directly or use external reader tools. You have earned +15 XP.
                      </p>
                      <a
                        href={currentPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Open/Download PDF Document</span>
                      </a>
                    </div>
                  </div>
                )}

                {filteredNotes.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
                    No study notes uploaded for this chapter yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredNotes.map((note) => (
                      <div key={note._id} className="glass-card p-5 rounded-2xl border flex justify-between items-center hover:border-blue-500/20 transition-all">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm">{note.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{note.description || 'Chapter notes PDF.'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentPdfUrl(note.pdfUrl);
                              setCurrentPdfTitle(note.title);
                              handleNotesRead(note._id);
                            }}
                            className="bg-blue-600 text-white p-2 rounded-xl text-xs"
                            title="Read Online"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <a
                            href={note.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleNotesRead(note._id)}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-xl"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Video Lectures List */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                {videos.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
                    No video lectures uploaded for this chapter yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {videos.map((vid) => {
                      const embedUrl = getEmbedUrl(vid.videoUrl);
                      return (
                        <div key={vid._id} className="glass-card overflow-hidden rounded-3xl border flex flex-col justify-between hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                          {/* YouTube Embedded Video */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b">
                            <iframe
                              src={embedUrl}
                              title={vid.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                          <div className="p-5 space-y-4">
                            {/* Title & Bookmark */}
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
                                  {selectedChapter?.name || 'Lecture'}
                                </span>
                                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1.5 leading-snug">
                                  {vid.title}
                                </h4>
                              </div>
                              <button
                                onClick={() => handleToggleBookmark(vid._id, vid.isBookmarked)}
                                className={`p-2 rounded-xl border transition-all ${
                                  vid.isBookmarked
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/25'
                                    : 'bg-white dark:bg-slate-805 hover:border-blue-500/30 text-slate-400'
                                }`}
                                title="Watch Later"
                              >
                                <Bookmark className={`h-4.5 w-4.5 ${vid.isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2">{vid.description}</p>

                            {/* Progress Tracking */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-slate-500">Watch Progress</span>
                                <span className="text-slate-850 dark:text-slate-200">{vid.progress?.watchPercentage || 0}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${vid.progress?.watchPercentage || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <button
                                onClick={() => navigate(`/watch/${vid._id}`)}
                                className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/15"
                              >
                                <Play className="h-3.5 w-3.5 fill-current" />
                                <span>{vid.progress?.completed ? 'Watch Again' : 'Watch Video'}</span>
                              </button>

                              <button
                                onClick={() => handleMarkCompleted(vid._id, vid.progress?.completed)}
                                disabled={vid.progress?.completed}
                                className={`flex items-center justify-center space-x-1 px-2 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                  vid.progress?.completed
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20 cursor-default font-bold'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 hover:border-green-500/30 text-slate-650 dark:text-slate-300'
                                }`}
                              >
                                <CheckCircle className={`h-4 w-4 ${vid.progress?.completed ? 'text-green-500 fill-current' : ''}`} />
                                <span>{vid.progress?.completed ? 'Completed' : 'Complete'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Chapter PYQs */}
            {activeTab === 'pyqs' && (
              <div className="space-y-4">
                {filteredPYQs.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
                    No chapter-wise previous year questions (PYQs) uploaded yet.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredPYQs.map((pyq) => (
                      <div key={pyq._id} className="glass-card p-5 rounded-2xl border flex justify-between items-center hover:border-blue-500/20 transition-all">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm">{pyq.title}</h4>
                          <p className="text-[10px] text-slate-400">Chapter PYQ PDF document</p>
                        </div>
                        <a
                          href={pyq.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white p-2.5 rounded-xl text-xs"
                        >
                          <Download className="h-4.5 w-4.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Solved Board Question Papers */}
            {activeTab === 'boardPapers' && (
              <div className="space-y-6">
                {/* Board Papers Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Board</label>
                    <select
                      value={paperBoardFilter}
                      onChange={(e) => setPaperBoardFilter(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-xs"
                    >
                      <option value="">All Boards</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Year</label>
                    <select
                      value={paperYearFilter}
                      onChange={(e) => setPaperYearFilter(e.target.value)}
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

                {filteredPapers.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
                    No board question papers found for this chapter yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPapers.map((paper) => (
                      <div key={paper._id} className="glass-card p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-500 uppercase">
                            <span>{paper.board}</span>
                            <span>&bull;</span>
                            <span>Year {paper.year}</span>
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
            )}

            {/* Section 5: Revision Shorts Vertical Reels Player */}
            {activeTab === 'shorts' && (
              <div className="space-y-6">
                {shorts.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs">
                    No concept revision shorts uploaded for this chapter yet.
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto space-y-8">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">EduSphere Shorts</span>
                      <h3 className="text-sm font-bold text-slate-500">Vertical Swipe / Scroll</h3>
                    </div>

                    <div className="shorts-container border bg-black rounded-3xl overflow-hidden relative shadow-2xl">
                      {shorts.map((short) => (
                        <div key={short._id} className="short-slide w-full h-[500px] relative flex flex-col justify-end text-white">
                          <iframe
                            src={getEmbedUrl(short.videoUrl)}
                            title={short.title}
                            className="absolute inset-0 w-full h-full border-none z-0"
                            allowFullScreen
                          ></iframe>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                          <div className="p-6 space-y-2 relative z-20">
                            <span className="text-[9px] font-bold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full inline-block">
                              Formula / concept
                            </span>
                            <h4 className="font-extrabold text-sm leading-snug">{short.title}</h4>
                            <p className="text-[10px] text-slate-300 leading-relaxed">{short.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDetail;
