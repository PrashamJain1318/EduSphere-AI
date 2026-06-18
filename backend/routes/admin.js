import express from 'express';
import {
  createSubject,
  getSubjectsAdmin,
  createChapter,
  getChaptersAdmin,
  uploadNotes,
  uploadVideo,
  uploadPYQ,
  uploadQuestionPaper,
  uploadRevisionShort,
  getUsers,
  deleteUser,
  getPlatformAnalytics,
  createResource,
  getResources,
  updateResource,
  deleteResource,
  getYouTubeVideoMetadata,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes require Admin authorization
router.use(protect);
router.use(authorize('admin'));

// Subjects & Chapters
router.post('/subjects', createSubject);
router.get('/subjects', getSubjectsAdmin);
router.post('/chapters', createChapter);
router.get('/chapters', getChaptersAdmin);

// Content Uploads
router.post('/upload/notes', upload.single('pdfFile'), uploadNotes);
router.post('/upload/video', uploadVideo);
router.post('/upload/pyq', upload.single('pdfFile'), uploadPYQ);
router.post(
  '/upload/question-paper',
  upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'solutionPdfFile', maxCount: 1 },
  ]),
  uploadQuestionPaper
);
router.post('/upload/short', uploadRevisionShort);

// Unified Resource Routes
router.post(
  '/resources',
  upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'solutionPdfFile', maxCount: 1 },
  ]),
  createResource
);
router.get('/resources', getResources);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);
router.get('/youtube-metadata', getYouTubeVideoMetadata);

// Users Management
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Platform Stats
router.get('/analytics', getPlatformAnalytics);

export default router;
