import express from 'express';
import {
  getSubjects,
  getChapters,
  getNotes,
  getVideos,
  getPYQs,
  getQuestionPapers,
  getRevisionShorts,
  updateProgress,
  getProgress,
  getLeaderboard,
  getChapterPapers,
  getChapterShorts,
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Material Retrieval
router.get('/subjects', getSubjects);
router.get('/subjects/:subjectId/chapters', getChapters);
router.get('/chapters/:chapterId/notes', getNotes);
router.get('/chapters/:chapterId/videos', getVideos);
router.get('/chapters/:chapterId/pyqs', getPYQs);
router.get('/chapters/:chapterId/papers', getChapterPapers);
router.get('/chapters/:chapterId/shorts', getChapterShorts);
router.get('/question-papers', getQuestionPapers);
router.get('/subjects/:subjectId/shorts', getRevisionShorts);

// Progress & Gamification
router.post('/progress', updateProgress);
router.get('/progress', getProgress);
router.get('/leaderboard', getLeaderboard);

export default router;
