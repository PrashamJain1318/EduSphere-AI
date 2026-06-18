import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Notes from '../models/Notes.js';
import Video from '../models/Video.js';
import PYQ from '../models/PYQ.js';
import QuestionPaper from '../models/QuestionPaper.js';
import RevisionShort from '../models/RevisionShort.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import Resource from '../models/Resource.js';

// ----------------------------------------------------
// SUBJECTS & CHAPTERS
// ----------------------------------------------------

export const createSubject = async (req, res) => {
  const { name, class: subClass, stream, code } = req.body;
  try {
    const subject = await Subject.create({
      name,
      class: subClass,
      stream: subClass === '12' ? stream : null,
      code,
    });
    res.status(201).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubjectsAdmin = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ class: 1, name: 1 });
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createChapter = async (req, res) => {
  const { subjectId, name, order, section } = req.body;
  try {
    const chapter = await Chapter.create({
      subjectId,
      name,
      order: order || 1,
      section: section || null,
    });
    res.status(201).json({ success: true, chapter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChaptersAdmin = async (req, res) => {
  const { subjectId } = req.query;
  try {
    const filter = subjectId ? { subjectId } : {};
    const chapters = await Chapter.find(filter).populate('subjectId', 'name class').sort({ order: 1 });
    res.json({ success: true, chapters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// NOTES UPLOAD
// ----------------------------------------------------

export const uploadNotes = async (req, res) => {
  const { title, subjectId, chapterId, description } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const pdfUrl = await uploadToCloudinary(req.file.path, 'raw');
    const subject = await Subject.findById(subjectId);

    const notes = await Resource.create({
      title,
      subjectId,
      chapterId,
      description,
      pdfUrl,
      resourceType: 'notes',
      class: subject.class,
      stream: subject.stream,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// VIDEOS UPLOAD
// ----------------------------------------------------

export const uploadVideo = async (req, res) => {
  const { title, description, subjectId, chapterId, videoUrl, category, duration } = req.body;
  try {
    // Extract YouTube Video ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    if (!match || match[2].length !== 11) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube Video URL. Must contain a valid 11-character Video ID.' });
    }
    const youtubeVideoId = match[2];
    const thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

    // Fetch parent subject to determine class & stream
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }

    const video = await Resource.create({
      title,
      description: description || 'No description provided.',
      subjectId,
      chapterId,
      videoUrl,
      youtubeVideoId,
      thumbnail,
      category: category || 'lectures',
      duration: duration || '10:00',
      resourceType: 'video',
      class: subject.class,
      stream: subject.stream,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// PYQs UPLOAD
// ----------------------------------------------------

export const uploadPYQ = async (req, res) => {
  const { title, subjectId, chapterId } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const pdfUrl = await uploadToCloudinary(req.file.path, 'raw');
    const subject = await Subject.findById(subjectId);

    const pyq = await Resource.create({
      title,
      subjectId,
      chapterId,
      pdfUrl,
      resourceType: 'pyq',
      class: subject.class,
      stream: subject.stream,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, pyq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// BOARD QUESTION PAPERS UPLOAD
// ----------------------------------------------------

export const uploadQuestionPaper = async (req, res) => {
  const { title, board, class: paperClass, subjectId, year } = req.body;
  try {
    const files = req.files;
    if (!files || !files.pdfFile) {
      return res.status(400).json({ success: false, message: 'Please upload the main Question Paper PDF' });
    }

    const pdfUrl = await uploadToCloudinary(files.pdfFile[0].path, 'raw');
    let solutionPdfUrl = '';
    if (files.solutionPdfFile) {
      solutionPdfUrl = await uploadToCloudinary(files.solutionPdfFile[0].path, 'raw');
    }

    const paper = await Resource.create({
      title,
      board,
      class: paperClass,
      subjectId,
      year: parseInt(year, 10),
      pdfUrl,
      solutionPdfUrl,
      resourceType: 'paper',
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// REVISION SHORTS UPLOAD
// ----------------------------------------------------

export const uploadRevisionShort = async (req, res) => {
  const { title, description, subjectId, videoUrl, duration } = req.body;
  try {
    const subject = await Subject.findById(subjectId);
    const revisionShort = await Resource.create({
      title,
      description,
      subjectId,
      videoUrl,
      duration: parseInt(duration, 10) || 30,
      resourceType: 'short',
      class: subject.class,
      stream: subject.stream,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, revisionShort });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// USER MANAGEMENT
// ----------------------------------------------------

export const getUsers = async (req, res) => {
  const { role, search } = req.query;
  try {
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin accounts' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// ANALYTICS
// ----------------------------------------------------

export const getPlatformAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalNotes = await Resource.countDocuments({ resourceType: 'notes' });
    const totalVideos = await Resource.countDocuments({ resourceType: 'video' });
    const totalPYQs = await Resource.countDocuments({ resourceType: 'pyq' });
    const totalPapers = await Resource.countDocuments({ resourceType: 'paper' });
    const totalShorts = await Resource.countDocuments({ resourceType: 'short' });

    res.json({
      success: true,
      analytics: {
        totalStudents,
        totalTeachers,
        totalNotes,
        totalVideos,
        totalPYQs,
        totalPapers,
        totalShorts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------
// UNIFIED RESOURCES CRUD
// ----------------------------------------------------

export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      class: resourceClass,
      stream,
      subjectId,
      chapterId,
      resourceType,
      videoUrl,
      board,
      year,
      category,
      duration,
    } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    let pdfUrl = '';
    let solutionPdfUrl = '';
    let youtubeVideoId = '';
    let thumbnail = '';

    // Upload PDF files if attached
    if (req.files) {
      if (req.files.pdfFile && req.files.pdfFile.length > 0) {
        pdfUrl = await uploadToCloudinary(req.files.pdfFile[0].path, 'raw');
      }
      if (req.files.solutionPdfFile && req.files.solutionPdfFile.length > 0) {
        solutionPdfUrl = await uploadToCloudinary(req.files.solutionPdfFile[0].path, 'raw');
      }
    }

    // Single file backward compatibility
    if (req.file) {
      pdfUrl = await uploadToCloudinary(req.file.path, 'raw');
    }

    // YouTube specific parsing
    if (['video', 'short'].includes(resourceType) && videoUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        youtubeVideoId = match[2];
        thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid YouTube link URL' });
      }
    }

    const resourceData = {
      title,
      description: description || 'No description provided.',
      class: resourceClass || subject.class,
      stream: subject.class === '12' ? (stream || subject.stream) : null,
      subjectId,
      resourceType,
      published: true,
      uploadedBy: req.user._id,
    };

    if (['notes', 'video', 'pyq', 'short'].includes(resourceType)) {
      if (!chapterId) {
        return res.status(400).json({ success: false, message: 'Chapter ID is required' });
      }
      resourceData.chapterId = chapterId;
    }

    if (['notes', 'pyq', 'paper'].includes(resourceType)) {
      resourceData.pdfUrl = pdfUrl;
    }

    if (resourceType === 'paper') {
      resourceData.solutionPdfUrl = solutionPdfUrl;
      resourceData.board = board;
      resourceData.year = year ? parseInt(year, 10) : new Date().getFullYear();
    }

    if (['video', 'short'].includes(resourceType)) {
      resourceData.videoUrl = videoUrl;
      resourceData.youtubeVideoId = youtubeVideoId;
      resourceData.thumbnail = thumbnail;
      resourceData.category = category || 'lectures';
      resourceData.duration = duration || (resourceType === 'short' ? '01:00' : '10:00');
    }

    const resource = await Resource.create(resourceData);
    res.status(201).json({ success: true, resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResources = async (req, res) => {
  try {
    const { search, resourceClass, subjectId, resourceType } = req.query;
    let query = {};

    if (resourceClass) query.class = resourceClass;
    if (subjectId) query.subjectId = subjectId;
    if (resourceType) query.resourceType = resourceType;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const resources = await Resource.find(query)
      .populate('subjectId', 'name class')
      .populate('chapterId', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, published } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (published !== undefined) updateData.published = published;

    const resource = await Resource.findByIdAndUpdate(id, updateData, { new: true });
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getYouTubeVideoMetadata = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL query parameter is required' });
  }

  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (!match || match[2].length !== 11) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube Video URL. Must contain a valid 11-character Video ID.' });
    }
    const videoId = match[2];
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    let title = 'YouTube Lecture';
    let description = 'Interactive video lecture.';
    let duration = '10:00';

    try {
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (response.ok) {
        const html = await response.text();
        
        // Parse title
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].replace(' - YouTube', '').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        }

        // Parse description
        const descMatch = html.match(/<meta name="description" content="(.*?)">/);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        }

        // Parse duration
        const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
        if (durationMatch && durationMatch[1]) {
          const secs = parseInt(durationMatch[1], 10);
          const mins = Math.floor(secs / 60);
          const remainingSecs = secs % 60;
          duration = `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
        }
      }
    } catch (err) {
      console.error('Error fetching details from YouTube watch page:', err);
    }

    res.json({
      success: true,
      metadata: {
        videoId,
        title,
        description,
        duration,
        thumbnail
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
