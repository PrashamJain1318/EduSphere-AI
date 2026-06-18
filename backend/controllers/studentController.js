import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Resource from '../models/Resource.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import VideoProgress from '../models/VideoProgress.js';
import Bookmark from '../models/Bookmark.js';

// ----------------------------------------------------
// SUBJECTS & CHAPTERS
// ----------------------------------------------------

export const getSubjects = async (req, res) => {
  try {
    const studentClass = req.user.class;
    const studentStream = req.user.stream;

    let filter = { class: studentClass };
    if (studentClass === '12') {
      filter.stream = studentStream;
    }

    const subjects = await Subject.find(filter).sort({ name: 1 });
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChapters = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const chapters = await Chapter.find({ subjectId }).sort({ order: 1 });
    res.json({ success: true, chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// ACADEMIC STUDY MATERIAL
// ----------------------------------------------------

export const getNotes = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const notes = await Resource.find({ chapterId, resourceType: 'notes', published: true }).populate('uploadedBy', 'name');
    res.json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVideos = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const videos = await Resource.find({ chapterId, resourceType: 'video', published: true }).lean();
    
    // Fetch user progress and bookmark state for these videos
    const videoIds = videos.map((v) => v._id);
    const progressList = await VideoProgress.find({ userId: req.user._id, videoId: { $in: videoIds } });
    const bookmarkList = await Bookmark.find({ userId: req.user._id, videoId: { $in: videoIds } });

    const videosWithState = videos.map((v) => {
      const prog = progressList.find((p) => p.videoId.toString() === v._id.toString());
      const isBookmarked = bookmarkList.some((b) => b.videoId.toString() === v._id.toString());
      return {
        ...v,
        progress: prog ? {
          watchTime: prog.watchTime,
          watchPercentage: prog.watchPercentage,
          completed: prog.completed,
        } : { watchTime: 0, watchPercentage: 0, completed: false },
        isBookmarked,
      };
    });

    res.json({ success: true, videos: videosWithState });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPYQs = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const pyqs = await Resource.find({ chapterId, resourceType: 'pyq', published: true }).populate('uploadedBy', 'name');
    res.json({ success: true, pyqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuestionPapers = async (req, res) => {
  const { subjectId } = req.query;
  try {
    const filter = {
      class: req.user.class,
      board: req.user.board,
      resourceType: 'paper',
      published: true,
    };
    if (subjectId) {
      filter.subjectId = subjectId;
    }

    const papers = await Resource.find(filter).populate('subjectId', 'name').sort({ year: -1 });
    res.json({ success: true, papers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevisionShorts = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const shorts = await Resource.find({ subjectId, resourceType: 'short', published: true }).populate('uploadedBy', 'name');
    res.json({ success: true, shorts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// PROGRESS TRACKING & GAMIFICATION
// ----------------------------------------------------

export const updateProgress = async (req, res) => {
  const { noteId, videoId, completedChapterId, studyMinutes } = req.body;
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    const user = await User.findById(req.user._id);
    let xpGain = 0;

    if (noteId && !progress.notesRead.includes(noteId)) {
      progress.notesRead.push(noteId);
      xpGain += 15; // 15 XP for reading notes
    }

    if (videoId && !progress.videosWatched.includes(videoId)) {
      progress.videosWatched.push(videoId);
      xpGain += 20; // 20 XP for watching a video lecture
    }

    if (completedChapterId && !progress.completedChapters.includes(completedChapterId)) {
      progress.completedChapters.push(completedChapterId);
      xpGain += 50; // 50 XP for finishing a chapter
    }

    if (studyMinutes) {
      progress.studyTime += parseInt(studyMinutes, 10);
      xpGain += Math.floor(parseInt(studyMinutes, 10) * 0.5); // 0.5 XP per minute of study
    }

    progress.updatedAt = new Date();
    await progress.save();

    if (xpGain > 0) {
      user.xp += xpGain;

      // Achievements Trigger logic
      if (progress.notesRead.length >= 5 && !user.badges.includes('Note Collector')) {
        user.badges.push('Note Collector');
      }
      if (progress.videosWatched.length >= 5 && !user.badges.includes('Video Scholar')) {
        user.badges.push('Video Scholar');
      }
      if (user.xp >= 500 && !user.badges.includes('Top Performer')) {
        user.badges.push('Top Performer');
      }

      await user.save();
    }

    res.json({
      success: true,
      progress,
      xpGained: xpGain,
      totalXp: user.xp,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id })
      .populate('notesRead', 'title')
      .populate('videosWatched', 'title')
      .populate('completedChapters', 'name');

    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// GAMIFICATION LEADERBOARD
// ----------------------------------------------------

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'student' })
      .select('name xp streak profilePicture class stream board')
      .sort({ xp: -1 })
      .limit(10);

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChapterPapers = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const papers = await Resource.find({ chapterId, resourceType: 'paper', published: true }).populate('uploadedBy', 'name');
    res.json({ success: true, papers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChapterShorts = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const shorts = await Resource.find({ chapterId, resourceType: 'short', published: true }).populate('uploadedBy', 'name');
    res.json({ success: true, shorts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
