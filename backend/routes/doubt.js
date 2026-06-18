import express from 'express';
import {
  askDoubt,
  getDoubts,
  getDoubtById,
  upvoteDoubt,
  answerDoubt,
  upvoteAnswer,
} from '../controllers/doubtController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoubts);
router.get('/:id', getDoubtById);

// Protected actions
router.post('/', protect, askDoubt);
router.put('/:id/upvote', protect, upvoteDoubt);
router.post('/:id/answers', protect, answerDoubt);
router.put('/:doubtId/answers/:answerId/upvote', protect, upvoteAnswer);

export default router;
