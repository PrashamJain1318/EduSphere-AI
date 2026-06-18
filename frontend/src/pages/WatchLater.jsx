import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Play, Trash, Loader2 } from 'lucide-react';
import api from '../utils/api.js';

const WatchLater = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/video/bookmarks');
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (e, videoId) => {
    e.stopPropagation();
    try {
      const res = await api.post('/video/bookmark/toggle', { videoId });
      if (res.data.success) {
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Saved Watch Later Playlist</h1>
          <p className="text-xs text-slate-500">Access your bookmarked board video lectures and revisions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" /></div>
      ) : videos.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-2xl text-slate-400 text-xs py-16">
          No saved video lectures found. Bookmark lectures during study sessions to assemble your revision list.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid._id}
              onClick={() => navigate(`/watch/${vid._id}`)}
              className="glass-card overflow-hidden rounded-2xl border flex flex-col justify-between hover:border-blue-500/30 cursor-pointer transition-all tilt-card h-80"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-10 w-10 text-white fill-current" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {vid.duration}
                </span>
              </div>

              {/* Info content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                    {vid.subjectId?.name || 'Curriculum'}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm mt-2 line-clamp-2 leading-snug">{vid.title}</h4>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-3 mt-4 border-slate-200/10">
                  <span>Syllabus category: <strong>{vid.category}</strong></span>
                  <button
                    onClick={(e) => handleRemoveBookmark(e, vid._id)}
                    className="text-red-500 hover:text-red-650 p-1.5 rounded-lg hover:bg-red-50"
                    title="Remove Bookmark"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchLater;
