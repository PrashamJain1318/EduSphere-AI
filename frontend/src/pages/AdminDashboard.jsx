import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Upload, PlusCircle, Trash, Search, Loader2, BookOpen } from 'lucide-react';
import api from '../utils/api.js';

const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalNotes: 0,
    totalVideos: 0,
    totalPYQs: 0,
    totalPapers: 0,
    totalShorts: 0,
  });

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Active Admin Action Tab
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, courseConfig, uploads, users

  // Search query for user list
  const [userSearch, setUserSearch] = useState('');

  // Course config states
  const [subName, setSubName] = useState('');
  const [subClass, setSubClass] = useState('10');
  const [subStream, setSubStream] = useState('Science');
  const [subCode, setSubCode] = useState('');
  const [chapName, setChapName] = useState('');
  const [chapSubId, setChapSubId] = useState('');
  const [chapOrder, setChapOrder] = useState(1);
  const [chapSection, setChapSection] = useState('First Flight');

  // Upload materials states
  const [uploadType, setUploadType] = useState('notes'); // notes, video, pyq, paper, short
  const [uploadSubjectId, setUploadSubjectId] = useState('');
  const [uploadChapterId, setUploadChapterId] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSolutionFile, setUploadSolutionFile] = useState(null);

  // Board paper specific states
  const [paperBoard, setPaperBoard] = useState('CBSE');
  const [paperClass, setPaperClass] = useState('10');
  const [paperYear, setPaperYear] = useState('2026');

  // Loader state for form submits
  const [submitting, setSubmitting] = useState(false);

  // Guided Upload states
  const [guidedClass, setGuidedClass] = useState('10');
  const [guidedStream, setGuidedStream] = useState('Science');
  const [guidedSubjectId, setGuidedSubjectId] = useState('');
  const [guidedChapterId, setGuidedChapterId] = useState('');
  const [guidedChapters, setGuidedChapters] = useState([]);
  const [guidedType, setGuidedType] = useState('notes'); // notes, video, pyq, paper, short
  const [guidedTitle, setGuidedTitle] = useState('');
  const [guidedDesc, setGuidedDesc] = useState('');
  const [guidedUrl, setGuidedUrl] = useState('');
  const [guidedFile, setGuidedFile] = useState(null);
  const [guidedSolutionFile, setGuidedSolutionFile] = useState(null);
  const [guidedBoard, setGuidedBoard] = useState('CBSE');
  const [guidedYear, setGuidedYear] = useState('2026');
  const [guidedCategory, setGuidedCategory] = useState('lectures');
  const [guidedDuration, setGuidedDuration] = useState('10:00');

  const [dragOver, setDragOver] = useState(false);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourceSearch, setResourceSearch] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const filteredSubjectsForUpload = subjects.filter(sub => {
    if (guidedClass === '10') {
      return sub.class === '10';
    } else {
      return sub.class === '12' && sub.stream === guidedStream;
    }
  });

  useEffect(() => {
    if (filteredSubjectsForUpload.length > 0) {
      setGuidedSubjectId(filteredSubjectsForUpload[0]._id);
    } else {
      setGuidedSubjectId('');
    }
  }, [guidedClass, guidedStream, subjects]);

  useEffect(() => {
    const fetchChaptersForGuided = async () => {
      if (!guidedSubjectId) {
        setGuidedChapters([]);
        setGuidedChapterId('');
        return;
      }
      try {
        const res = await api.get(`/admin/chapters?subjectId=${guidedSubjectId}`);
        if (res.data.success) {
          setGuidedChapters(res.data.chapters);
          if (res.data.chapters.length > 0) {
            setGuidedChapterId(res.data.chapters[0]._id);
          } else {
            setGuidedChapterId('');
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchChaptersForGuided();
  }, [guidedSubjectId]);

  const fetchResources = async () => {
    try {
      setResourcesLoading(true);
      const res = await api.get('/admin/resources');
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResourcesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'socialScience') {
      fetchResources();
    }
  }, [activeTab]);

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const res = await api.put(`/admin/resources/${id}`, {
        published: !currentStatus
      });
      if (res.data.success) {
        setResources(prev => prev.map(r => r._id === id ? { ...r, published: !currentStatus } : r));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update resource status');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resource?')) return;
    try {
      const res = await api.delete(`/admin/resources/${id}`);
      if (res.data.success) {
        setResources(prev => prev.filter(r => r._id !== id));
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!guidedSubjectId || !guidedTitle) return;
    setUploading(true);
    setUploadProgress(10);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const fd = new FormData();
      fd.append('title', guidedTitle);
      fd.append('description', guidedDesc);
      fd.append('class', guidedClass);
      if (guidedClass === '12') fd.append('stream', guidedStream);
      fd.append('subjectId', guidedSubjectId);
      fd.append('resourceType', guidedType);

      if (['notes', 'video', 'pyq', 'short'].includes(guidedType)) {
        fd.append('chapterId', guidedChapterId);
      }

      if (['notes', 'pyq', 'paper'].includes(guidedType)) {
        if (guidedFile) fd.append('pdfFile', guidedFile);
      }
      if (guidedType === 'paper') {
        if (guidedSolutionFile) fd.append('solutionPdfFile', guidedSolutionFile);
        fd.append('board', guidedBoard);
        fd.append('year', guidedYear);
      }
      if (['video', 'short'].includes(guidedType)) {
        fd.append('videoUrl', guidedUrl);
        fd.append('category', guidedCategory);
        fd.append('duration', guidedDuration);
      }

      const res = await api.post('/admin/resources', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          // Reset fields
          setGuidedTitle('');
          setGuidedDesc('');
          setGuidedUrl('');
          setGuidedFile(null);
          setGuidedSolutionFile(null);
          fetchResources();
          fetchStats();
          alert('Resource published successfully!');
        }, 300);
      }
    } catch (err) {
      clearInterval(timer);
      setUploading(false);
      setUploadProgress(0);
      alert(err.response?.data?.message || 'Failed to publish resource');
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setStats(res.data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/admin/subjects');
      if (res.data.success) {
        setSubjects(res.data.subjects);
        if (res.data.subjects.length > 0) {
          setChapSubId(res.data.subjects[0]._id);
          setUploadSubjectId(res.data.subjects[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChapters = async (subId) => {
    if (!subId) return;
    try {
      const res = await api.get(`/admin/chapters?subjectId=${subId}`);
      if (res.data.success) {
        setChapters(res.data.chapters);
        if (res.data.chapters.length > 0) {
          setUploadChapterId(res.data.chapters[0]._id);
        } else {
          setUploadChapterId('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?search=${userSearch}`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, userSearch]);

  useEffect(() => {
    if (uploadSubjectId) {
      fetchChapters(uploadSubjectId);
    }
  }, [uploadSubjectId]);

  useEffect(() => {
    const videoId = getYoutubeId(guidedUrl);
    if (!videoId) return;

    const fetchMeta = async () => {
      try {
        const res = await api.get(`/admin/youtube-metadata?url=${encodeURIComponent(guidedUrl)}`);
        if (res.data.success) {
          const { title, description, duration } = res.data.metadata;
          setGuidedTitle(title);
          setGuidedDesc(description);
          setGuidedDuration(duration);
        }
      } catch (err) {
        console.error('Failed to fetch YouTube metadata:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMeta();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [guidedUrl]);

  useEffect(() => {
    const videoId = getYoutubeId(uploadUrl);
    if (!videoId) return;

    const fetchMeta = async () => {
      try {
        const res = await api.get(`/admin/youtube-metadata?url=${encodeURIComponent(uploadUrl)}`);
        if (res.data.success) {
          const { title, description } = res.data.metadata;
          setUploadTitle(title);
          setUploadDesc(description);
        }
      } catch (err) {
        console.error('Failed to fetch YouTube metadata:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMeta();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [uploadUrl]);

  // Create subject submit
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subName) return;
    setSubmitting(true);
    try {
      const res = await api.post('/admin/subjects', {
        name: subName,
        class: subClass,
        stream: subClass === '12' ? subStream : null,
        code: subCode,
      });
      if (res.data.success) {
        alert('Subject created successfully!');
        setSubName('');
        setSubCode('');
        fetchSubjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Create chapter submit
  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!chapName || !chapSubId) return;
    setSubmitting(true);
    try {
      const selectedSub = subjects.find(s => s._id === chapSubId);
      const isEnglish = selectedSub && selectedSub.name.toLowerCase() === 'english';
      const res = await api.post('/admin/chapters', {
        subjectId: chapSubId,
        name: chapName,
        order: chapOrder,
        section: isEnglish ? chapSection : null,
      });
      if (res.data.success) {
        alert('Chapter created successfully!');
        setChapName('');
        setChapOrder(1);
        if (chapSubId === uploadSubjectId) {
          fetchChapters(chapSubId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Upload materials submit
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!uploadSubjectId || !uploadTitle) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', uploadTitle);
      fd.append('subjectId', uploadSubjectId);

      if (['notes', 'video', 'pyq'].includes(uploadType)) {
        if (!uploadChapterId) {
          setSubmitting(false);
          return alert('Please select a chapter first.');
        }
        fd.append('chapterId', uploadChapterId);
      }

      if (uploadType === 'notes') {
        if (!uploadFile) {
          setSubmitting(false);
          return alert('Please select notes PDF file');
        }
        fd.append('description', uploadDesc);
        fd.append('pdfFile', uploadFile);
        await api.post('/admin/upload/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else if (uploadType === 'pyq') {
        if (!uploadFile) {
          setSubmitting(false);
          return alert('Please select PYQ PDF file');
        }
        fd.append('pdfFile', uploadFile);
        await api.post('/admin/upload/pyq', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else if (uploadType === 'paper') {
        if (!uploadFile) {
          setSubmitting(false);
          return alert('Please select main paper PDF');
        }
        fd.append('board', paperBoard);
        fd.append('class', paperClass);
        fd.append('year', paperYear);
        fd.append('pdfFile', uploadFile);
        if (uploadSolutionFile) {
          fd.append('solutionPdfFile', uploadSolutionFile);
        }
        await api.post('/admin/upload/question-paper', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else if (uploadType === 'video') {
        if (!uploadUrl) {
          setSubmitting(false);
          return alert('Please provide YouTube Link');
        }
        await api.post('/admin/upload/video', {
          title: uploadTitle,
          description: uploadDesc,
          subjectId: uploadSubjectId,
          chapterId: uploadChapterId,
          videoUrl: uploadUrl,
        });
      } else if (uploadType === 'short') {
        if (!uploadUrl) {
          setSubmitting(false);
          return alert('Please provide YouTube short link');
        }
        await api.post('/admin/upload/short', {
          title: uploadTitle,
          description: uploadDesc,
          subjectId: uploadSubjectId,
          videoUrl: uploadUrl,
        });
      }

      alert('Resource uploaded successfully!');
      // Clear forms
      setUploadTitle('');
      setUploadDesc('');
      setUploadUrl('');
      setUploadFile(null);
      setUploadSolutionFile(null);
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.success) {
        alert(res.data.message);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete user failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-red-600 text-white p-2.5 rounded-2xl shadow-md"><LayoutDashboard className="h-6 w-6" /></div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">EduSphere Admin Panel</h1>
          <p className="text-xs text-slate-500">Manage curriculum subjects, upload study files, and audit students accounts</p>
        </div>
      </div>

      {/* Admin Action Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
        {[
          { id: 'analytics', label: 'Platform Stats', icon: <LayoutDashboard className="h-4 w-4" /> },
          { id: 'courseConfig', label: 'Configure Course (Subjects/Chapters)', icon: <PlusCircle className="h-4 w-4" /> },
          { id: 'uploads', label: 'Upload Materials', icon: <Upload className="h-4 w-4" /> },
          { id: 'socialScience', label: 'Resource Center', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'users', label: 'Manage Users', icon: <Users className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Tab Content 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl border shadow-sm text-center">
                <div className="text-3xl font-extrabold text-blue-600">{stats.totalStudents}</div>
                <div className="text-xs text-slate-500 mt-2">Total Students</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border shadow-sm text-center">
                <div className="text-3xl font-extrabold text-indigo-600">{stats.totalNotes}</div>
                <div className="text-xs text-slate-500 mt-2">Notes Uploaded</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border shadow-sm text-center">
                <div className="text-3xl font-extrabold text-purple-600">{stats.totalVideos}</div>
                <div className="text-xs text-slate-500 mt-2">Video Lectures</div>
              </div>
              <div className="glass-card p-6 rounded-2xl border shadow-sm text-center">
                <div className="text-3xl font-extrabold text-emerald-600">{stats.totalPapers}</div>
                <div className="text-xs text-slate-500 mt-2">Board Papers</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Course Setup Config */}
      {activeTab === 'courseConfig' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Subject Form */}
          <form onSubmit={handleCreateSubject} className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1">
              <PlusCircle className="h-4.5 w-4.5 text-blue-500" />
              <span>Create New Subject</span>
            </h3>
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Science"
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Class</label>
                <select
                  value={subClass}
                  onChange={(e) => setSubClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="10">Class 10</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
              {subClass === '12' && (
                <div>
                  <label className="block text-slate-500 mb-1">Stream (Class 12 Only)</label>
                  <select
                    value={subStream}
                    onChange={(e) => setSubStream(e.target.value)}
                    className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-slate-500 mb-1">Subject Code / Tag</label>
                <input
                  type="text"
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="e.g. SCI-101"
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              {submitting ? 'Creating...' : 'Create Subject'}
            </button>
          </form>

          {/* Create Chapter Form */}
          <form onSubmit={handleCreateChapter} className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-1">
              <PlusCircle className="h-4.5 w-4.5 text-indigo-500" />
              <span>Create New Chapter</span>
            </h3>
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Parent Subject</label>
                <select
                  value={chapSubId}
                  onChange={(e) => setChapSubId(e.target.value)}
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} (Class {sub.class} {sub.stream ? `- ${sub.stream}` : ''})
                    </option>
                  ))}
                </select>
              </div>
              {subjects.find(s => s._id === chapSubId)?.name?.toLowerCase() === 'english' && (
                <div>
                  <label className="block text-slate-500 mb-1">English Section</label>
                  <select
                    value={chapSection}
                    onChange={(e) => setChapSection(e.target.value)}
                    className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="First Flight">First Flight</option>
                    <option value="Poems">Poems</option>
                    <option value="Footprints Without Feet">Footprints Without Feet</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-slate-500 mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  value={chapName}
                  onChange={(e) => setChapName(e.target.value)}
                  placeholder="e.g. Light Reflection and Refraction"
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Order Index</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={chapOrder}
                  onChange={(e) => setChapOrder(e.target.value)}
                  className="w-full p-2.5 bg-slate-55 dark:bg-slate-800 border rounded-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              {submitting ? 'Creating...' : 'Create Chapter'}
            </button>
          </form>
        </div>
      )}

      {/* Tab Content 3: Material Uploads */}
      {activeTab === 'uploads' && (
        <form onSubmit={handleUploadMaterial} className="glass-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-1">
            <Upload className="h-4.5 w-4.5 text-blue-500" />
            <span>Upload Course Resources</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-xs font-semibold">
            {/* Resource Type */}
            <div>
              <label className="block text-slate-500 mb-2">Resource Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
              >
                <option value="notes">Chapter Study Notes PDF</option>
                <option value="video">YouTube Video Lecture Link</option>
                <option value="pyq">Chapter PYQ PDF</option>
                <option value="paper">Board Solved Question Paper</option>
                <option value="short">1-Minute Revision Short</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-slate-500 mb-2">Subject</label>
              <select
                value={uploadSubjectId}
                onChange={(e) => setUploadSubjectId(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
              >
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} (Class {sub.class})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selector (Notes, PYQs, Videos only) */}
            {['notes', 'video', 'pyq'].includes(uploadType) && (
              <div>
                <label className="block text-slate-500 mb-2">Chapter</label>
                <select
                  value={uploadChapterId}
                  onChange={(e) => setUploadChapterId(e.target.value)}
                  disabled={chapters.length === 0}
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl disabled:bg-slate-100"
                >
                  {chapters.map((chap) => (
                    <option key={chap._id} value={chap._id}>{chap.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-slate-500 mb-2">Resource Title</label>
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Chapter 1 Formula Sheet / Solved Paper 2026"
                className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
              />
            </div>

            {/* YouTube Link (Videos/Shorts only) */}
            {['video', 'short'].includes(uploadType) && (
              <div className="md:col-span-2">
                <label className="block text-slate-500 mb-2">YouTube URL Link</label>
                <input
                  type="url"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                />
              </div>
            )}

            {/* Board Paper Filters */}
            {uploadType === 'paper' && (
              <>
                <div>
                  <label className="block text-slate-500 mb-2">Select Board</label>
                  <select
                    value={paperBoard}
                    onChange={(e) => setPaperBoard(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-2">Select Class</label>
                  <select
                    value={paperClass}
                    onChange={(e) => setPaperClass(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="10">Class 10</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-2">Year</label>
                  <input
                    type="number"
                    required
                    value={paperYear}
                    onChange={(e) => setPaperYear(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </>
            )}

            {/* Description (Notes, videos, shorts only) */}
            {['notes', 'video', 'short'].includes(uploadType) && (
              <div className="md:col-span-2">
                <label className="block text-slate-500 mb-2">Description</label>
                <textarea
                  rows="3"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Short explanation of note content or lecture goals..."
                  className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                ></textarea>
              </div>
            )}

            {/* File Input (Notes, PYQs, Papers only) */}
            {['notes', 'pyq', 'paper'].includes(uploadType) && (
              <div>
                <label className="block text-slate-500 mb-2">
                  {uploadType === 'paper' ? 'Upload Question Paper PDF' : 'Upload Study PDF File'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            )}

            {/* Solution File Input (Papers only) */}
            {uploadType === 'paper' && (
              <div>
                <label className="block text-slate-500 mb-2">Upload Solutions PDF File (Optional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadSolutionFile(e.target.files[0])}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
          >
            {submitting ? 'Uploading...' : 'Publish Content Resource'}
          </button>
        </form>
      )}

      {/* Tab Content 4: Manage Users */}
      {activeTab === 'users' && (
        <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-sm font-bold">Audit Student Registry</h3>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Users List Table */}
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="p-4 font-bold">User Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 font-bold">Board / Class</th>
                  <th className="p-4 font-bold">Stream</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">No students registered yet.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50">
                      <td className="p-4 font-semibold">{u.name}</td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4 font-bold uppercase text-[10px] text-blue-500">{u.role}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {u.role === 'student' ? `${u.board} (Class ${u.class})` : 'N/A'}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{u.stream || 'N/A'}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 5: Unified Resource Center */}
      {activeTab === 'socialScience' && (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left span: Guided Upload Form */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
            <div className="border-b pb-4 border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-base font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Upload className="h-5 w-5" />
                <span>Guided Content Resource Publisher</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Upload educational materials with smart auto-routing based on Class, Stream, Subject, and Chapter.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4 text-xs font-semibold">
                {/* Class Selection */}
                <div>
                  <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Class</label>
                  <select
                    value={guidedClass}
                    onChange={(e) => setGuidedClass(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="10">Class 10th</option>
                    <option value="12">Class 12th</option>
                  </select>
                </div>

                {/* Stream Selection (Class 12 only) */}
                {guidedClass === '12' ? (
                  <div>
                    <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Stream</label>
                    <select
                      value={guidedStream}
                      onChange={(e) => setGuidedStream(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                    >
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Humanities">Humanities</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px] opacity-40">Stream</label>
                    <input
                      type="text"
                      disabled
                      value="N/A (Class 10 Core)"
                      className="w-full p-3 bg-slate-100 dark:bg-slate-800/50 border rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>
                )}

                {/* Subject Selection */}
                <div>
                  <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Subject</label>
                  <select
                    value={guidedSubjectId}
                    onChange={(e) => setGuidedSubjectId(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    {filteredSubjectsForUpload.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                    {filteredSubjectsForUpload.length === 0 && (
                      <option value="">No subjects active</option>
                    )}
                  </select>
                </div>

                {/* Resource Type */}
                <div>
                  <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Resource Type</label>
                  <select
                    value={guidedType}
                    onChange={(e) => setGuidedType(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="notes">Chapter Notes PDF</option>
                    <option value="video">YouTube Video Lecture</option>
                    <option value="pyq">Chapter PYQ solved PDF</option>
                    <option value="paper">Previous Year Board Paper</option>
                    <option value="short">Concept Revision Short (1-Min)</option>
                  </select>
                </div>

                {/* Chapter Selection (Required for notes, videos, pyqs, shorts) */}
                {['notes', 'video', 'pyq', 'short'].includes(guidedType) && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-500 mb-2 uppercase tracking-wider text-[10px]">Chapter</label>
                    <select
                      value={guidedChapterId}
                      onChange={(e) => setGuidedChapterId(e.target.value)}
                      disabled={guidedChapters.length === 0}
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl disabled:bg-slate-100"
                    >
                      {guidedChapters.map((chap) => (
                        <option key={chap._id} value={chap._id}>{chap.name}</option>
                      ))}
                      {guidedChapters.length === 0 && (
                        <option value="">No chapters configured</option>
                      )}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-slate-500 mb-2">Resource Title</label>
                  <input
                    type="text"
                    required
                    value={guidedTitle}
                    onChange={(e) => setGuidedTitle(e.target.value)}
                    placeholder="e.g. Chemical Reactions Formula Sheet"
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                {/* Description */}
                {['notes', 'video', 'short'].includes(guidedType) && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-500 mb-2">Description / Topics Covered</label>
                    <textarea
                      rows="2"
                      value={guidedDesc}
                      onChange={(e) => setGuidedDesc(e.target.value)}
                      placeholder="Add brief details about what students will learn..."
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                    ></textarea>
                  </div>
                )}

                {/* Board Paper Filters */}
                {guidedType === 'paper' && (
                  <>
                    <div>
                      <label className="block text-slate-500 mb-2">Board</label>
                      <select
                        value={guidedBoard}
                        onChange={(e) => setGuidedBoard(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                      >
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-2">Year</label>
                      <input
                        type="number"
                        required
                        value={guidedYear}
                        onChange={(e) => setGuidedYear(e.target.value)}
                        className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                      />
                    </div>
                  </>
                )}

                {/* Video Category & Duration (Videos/Shorts only) */}
                {guidedType === 'video' && (
                  <div>
                    <label className="block text-slate-500 mb-2">Category</label>
                    <select
                      value={guidedCategory}
                      onChange={(e) => setGuidedCategory(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                    >
                      <option value="lectures">Full Lecture</option>
                      <option value="pyqs">PYQ Discussion</option>
                      <option value="numericals">Numerical & Concepts</option>
                    </select>
                  </div>
                )}

                {['video', 'short'].includes(guidedType) && (
                  <div className={guidedType === 'short' ? 'md:col-span-2' : ''}>
                    <label className="block text-slate-500 mb-2">Duration (MM:SS)</label>
                    <input
                      type="text"
                      required
                      value={guidedDuration}
                      onChange={(e) => setGuidedDuration(e.target.value)}
                      placeholder="e.g. 45:12 or 01:00"
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                )}

                {/* YouTube Link (Videos/Shorts only) */}
                {['video', 'short'].includes(guidedType) && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-500 mb-2">YouTube URL Link</label>
                    <input
                      type="url"
                      required
                      value={guidedUrl}
                      onChange={(e) => setGuidedUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=g-5W5v-3Y78"
                      className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* YouTube Thumbnail Preview */}
              {['video', 'short'].includes(guidedType) && getYoutubeId(guidedUrl) && (
                <div className="rounded-2xl border p-4 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Live YouTube Preview</span>
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeId(guidedUrl)}/mqdefault.jpg`}
                      alt="YouTube Preview"
                      className="w-40 h-24 object-cover rounded-xl shadow border"
                    />
                    <div className="space-y-1 self-start">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{guidedTitle || 'Video Lecture'}</h4>
                      <p className="text-[10px] text-slate-500">ID: {getYoutubeId(guidedUrl)}</p>
                      <p className="text-[10px] text-slate-500">Duration: {guidedDuration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Drag and Drop Zone (Files only) */}
              {['notes', 'pyq', 'paper'].includes(guidedType) && (
                <div className="space-y-2">
                  <label className="block text-xs text-slate-500">Attach Document Resource</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      dragOver 
                        ? 'border-blue-500 bg-blue-500/5' 
                        : guidedFile 
                          ? 'border-green-500 bg-green-500/5' 
                          : 'border-slate-200 hover:border-blue-500/50 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="file"
                      id="guided-file-input"
                      accept=".pdf"
                      required={!guidedFile}
                      onChange={(e) => setGuidedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="guided-file-input" className="cursor-pointer space-y-2 block">
                      <Upload className={`h-8 w-8 mx-auto ${guidedFile ? 'text-green-500' : 'text-slate-400'}`} />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {guidedFile ? guidedFile.name : 'Drag & Drop PDF or click to browse'}
                      </p>
                      <p className="text-[10px] text-slate-400">PDF documents only</p>
                    </label>
                  </div>
                </div>
              )}

              {/* Solution PDF File Zone (Papers only) */}
              {guidedType === 'paper' && (
                <div className="space-y-2">
                  <label className="block text-xs text-slate-500">Attach Answer Key / Solution PDF (Optional)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setGuidedSolutionFile(e.target.files[0])}
                    className="w-full p-2 border rounded-xl text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              )}

              {/* simulated upload progress */}
              {uploading && (
                <div className="space-y-2 w-full pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Uploading content resource files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                {uploading ? 'Processing & Publishing...' : 'Publish Content Resource'}
              </button>
            </form>
          </div>

          {/* Right span: Resource Management Table */}
          <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <div className="border-b pb-3 border-slate-200/50 dark:border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Live Curriculum Ledger</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Toggle publication states or delete resources instantly.</p>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Filter resources by title..."
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
              />
            </div>

            {/* Resources List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {resourcesLoading ? (
                <div className="text-center py-6"><Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" /></div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed rounded-2xl bg-slate-50/40">
                  No matching resources published.
                </div>
              ) : (
                filteredResources.map((res) => (
                  <div key={res._id} className="p-3.5 rounded-2xl border bg-white dark:bg-slate-800/60 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700 transition-all">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {res.resourceType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Class {res.class} {res.stream ? `• ${res.stream}` : ''}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mt-2 text-slate-800 dark:text-slate-100 line-clamp-2">{res.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Subject: <span className="font-semibold">{res.subjectId?.name || 'N/A'}</span>
                        {res.chapterId && <> • Chapter: <span className="font-semibold">{res.chapterId?.name || 'N/A'}</span></>}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2.5 border-slate-100 dark:border-slate-800/60 mt-1">
                      <button
                        onClick={() => handleTogglePublish(res._id, res.published)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          res.published 
                            ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {res.published ? 'Published' : 'Hidden'}
                      </button>

                      <button
                        onClick={() => handleDeleteResource(res._id)}
                        className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
