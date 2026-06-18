import express from 'express';
import {
  addVideo,
  deleteVideo,
  getVideosByChapter,
  getVideoDetail,
  updateVideoProgress,
  toggleBookmark,
  getBookmarkedVideos,
  addComment,
  replyComment,
  upvoteComment,
  pinComment,
  getContinueWatching,
} from '../controllers/videoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Material Retrieval
router.get('/chapter/:chapterId', getVideosByChapter);
router.get('/detail/:id', getVideoDetail);
router.get('/bookmarks', getBookmarkedVideos);
router.get('/continue', getContinueWatching);

// Progress & Interactions
router.post('/progress', updateVideoProgress);
router.post('/bookmark/toggle', toggleBookmark);

// Comments Discussion forum
router.post('/comments', addComment);
router.post('/comments/reply', replyComment);
router.put('/comments/:id/upvote', upvoteComment);
router.put('/comments/:id/pin', pinComment);

// Admin Control Panel (CRUD)
router.post('/admin/add', authorize('admin'), addVideo);
router.delete('/admin/:id', authorize('admin'), deleteVideo);

export default router;
