import Resource from '../models/Resource.js';
import VideoProgress from '../models/VideoProgress.js';
import Bookmark from '../models/Bookmark.js';
import VideoComment from '../models/VideoComment.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';

// Extract YouTube ID helper
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * @desc    Add a video (Admin only)
 * @route   POST /api/video/admin/add
 * @access  Private/Admin
 */
export const addVideo = async (req, res) => {
  const { title, description, videoUrl, subjectId, chapterId, category, duration } = req.body;

  try {
    const youtubeVideoId = extractVideoId(videoUrl);
    if (!youtubeVideoId) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube Video URL' });
    }

    const subject = await Subject.findById(subjectId);
    const chapter = await Chapter.findById(chapterId);

    if (!subject || !chapter) {
      return res.status(404).json({ success: false, message: 'Subject or Chapter not found' });
    }

    // Default values if Data API v3 not configured
    const thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
    
    const video = await Resource.create({
      title,
      description: description || 'No description provided.',
      videoUrl,
      youtubeVideoId,
      thumbnail,
      duration: duration || '10:00',
      subjectId,
      chapterId,
      category: category || 'lectures',
      class: subject.class,
      stream: subject.stream,
      resourceType: 'video',
      published: true,
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a video (Admin only)
 * @route   DELETE /api/video/admin/:id
 * @access  Private/Admin
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Resource.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get videos by chapter grouped by category
 * @route   GET /api/video/chapter/:chapterId
 * @access  Private
 */
export const getVideosByChapter = async (req, res) => {
  try {
    const videos = await Resource.find({ chapterId: req.params.chapterId, resourceType: 'video', published: true }).sort({ createdAt: 1 });
    
    // Group by category
    const grouped = {
      lectures: videos.filter((v) => v.category === 'lectures'),
      pyqs: videos.filter((v) => v.category === 'pyqs'),
      numericals: videos.filter((v) => v.category === 'numericals'),
      shorts: videos.filter((v) => v.category === 'shorts'),
    };

    res.json({ success: true, grouped, allVideos: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get video detail along with progress, comments, and bookmarks
 * @route   GET /api/video/detail/:id
 * @access  Private
 */
export const getVideoDetail = async (req, res) => {
  try {
    const video = await Resource.findById(req.params.id)
      .populate('subjectId', 'name')
      .populate('chapterId', 'name');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Update views counter
    video.views = (video.views || 0) + 1;
    await video.save();

    // Get student progress
    const progress = await VideoProgress.findOne({ userId: req.user._id, videoId: video._id });

    // Get bookmark status
    const isBookmarked = await Bookmark.exists({ userId: req.user._id, videoId: video._id });

    // Get comments and doubts discussion threads
    const comments = await VideoComment.find({ videoId: video._id })
      .populate('userId', 'name role profilePicture')
      .populate('replies.userId', 'name role profilePicture')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      video,
      progress: progress || { watchTime: 0, watchPercentage: 0, completed: false },
      isBookmarked: !!isBookmarked,
      comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update video watch time progress and award XP on complete
 * @route   POST /api/video/progress
 * @access  Private
 */
export const updateVideoProgress = async (req, res) => {
  const { videoId, watchTime, durationSeconds } = req.body;
  if (!videoId || watchTime === undefined || !durationSeconds) {
    return res.status(400).json({ success: false, message: 'Missing progress parameters' });
  }

  try {
    const watchPercentage = Math.min(100, Math.floor((watchTime / durationSeconds) * 100));
    const completed = watchPercentage >= 90;

    let progress = await VideoProgress.findOne({ userId: req.user._id, videoId });
    let previouslyCompleted = progress ? progress.completed : false;

    if (!progress) {
      progress = new VideoProgress({
        userId: req.user._id,
        videoId,
        watchTime,
        watchPercentage,
        completed,
      });
    } else {
      progress.watchTime = Math.max(progress.watchTime, watchTime);
      progress.watchPercentage = Math.max(progress.watchPercentage, watchPercentage);
      if (completed) {
        progress.completed = true;
      }
      progress.lastWatchedAt = new Date();
    }

    await progress.save();

    let xpGained = 0;
    const user = await User.findById(req.user._id);

    // Award +20 XP if newly completed
    if (completed && !previouslyCompleted) {
      xpGained = 20;
      user.xp += xpGained;

      // Check badges triggers
      const completedCount = await VideoProgress.countDocuments({ userId: req.user._id, completed: true });
      if (completedCount >= 1 && !user.badges.includes('First Lecture Completed')) {
        user.badges.push('First Lecture Completed');
      }
      if (completedCount >= 10 && !user.badges.includes('10 Videos Watched')) {
        user.badges.push('10 Videos Watched');
      }
      await user.save();
    }

    res.json({
      success: true,
      progress,
      xpGained,
      totalXp: user.xp,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle bookmark watch later
 * @route   POST /api/video/bookmark/toggle
 * @access  Private
 */
export const toggleBookmark = async (req, res) => {
  const { videoId } = req.body;
  try {
    const existing = await Bookmark.findOne({ userId: req.user._id, videoId });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      res.json({ success: true, isBookmarked: false, message: 'Removed from Watch Later' });
    } else {
      await Bookmark.create({ userId: req.user._id, videoId });
      res.json({ success: true, isBookmarked: true, message: 'Added to Watch Later' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get bookmarked Watch Later videos
 * @route   GET /api/video/bookmarks
 * @access  Private
 */
export const getBookmarkedVideos = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate({
      path: 'videoId',
      populate: { path: 'subjectId', select: 'name' },
    });
    const videos = bookmarks.map((b) => b.videoId).filter(Boolean);
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// DISCUSSION THREAD COMMENTS
// ----------------------------------------------------

export const addComment = async (req, res) => {
  const { videoId, comment } = req.body;
  try {
    const commentDoc = await VideoComment.create({
      videoId,
      userId: req.user._id,
      comment,
    });
    const populated = await VideoComment.findById(commentDoc._id).populate('userId', 'name role profilePicture');
    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyComment = async (req, res) => {
  const { commentId, text } = req.body;
  try {
    const commentDoc = await VideoComment.findById(commentId);
    if (!commentDoc) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    commentDoc.replies.push({
      userId: req.user._id,
      text,
    });

    await commentDoc.save();
    const updated = await VideoComment.findById(commentId)
      .populate('userId', 'name role profilePicture')
      .populate('replies.userId', 'name role profilePicture');

    res.json({ success: true, comment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const upvoteComment = async (req, res) => {
  try {
    const comment = await VideoComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    const userId = req.user._id;
    if (comment.upvotes.includes(userId)) {
      comment.upvotes = comment.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      comment.upvotes.push(userId);
    }
    await comment.save();
    res.json({ success: true, upvotesCount: comment.upvotes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const pinComment = async (req, res) => {
  try {
    // Only teacher/admin can pin
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Only teachers can pin comments.' });
    }

    const comment = await VideoComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    comment.isPinned = !comment.isPinned;
    await comment.save();

    res.json({ success: true, isPinned: comment.isPinned });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// DYNAMIC WORKSPACE UTILS
// ----------------------------------------------------

export const getContinueWatching = async (req, res) => {
  try {
    const progress = await VideoProgress.find({ userId: req.user._id, completed: false })
      .sort({ lastWatchedAt: -1 })
      .populate({
        path: 'videoId',
        populate: [{ path: 'subjectId', select: 'name' }, { path: 'chapterId', select: 'name' }],
      })
      .limit(1);

    if (progress.length === 0) {
      return res.json({ success: true, progress: null });
    }

    res.json({ success: true, progress: progress[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
