import express from 'express';
import {
  askDoubtAI,
  createStudyPlanAI,
  generateMockQuestionsAI,
  submitTestResult,
  getRecommendations,
  summarizeNotes,
  generateQuiz,
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/doubt', askDoubtAI);
router.post('/plan', createStudyPlanAI);
router.post('/generate-test', generateMockQuestionsAI);
router.post('/submit-test', submitTestResult);
router.get('/recommendations', getRecommendations);
router.post('/summarize-notes', summarizeNotes);
router.post('/generate-quiz', generateQuiz);

export default router;
