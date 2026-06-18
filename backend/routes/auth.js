import express from 'express';
import {
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/profile', protect, getUserProfile);

export default router;
