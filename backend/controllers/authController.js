import User from '../models/User.js';
import Progress from '../models/Progress.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforedusphereai2026', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user (student or teacher)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role, board, class: userClass, stream } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Role-based validation
    if (role === 'student') {
      if (!board || !userClass) {
        return res.status(400).json({ success: false, message: 'Board and Class are required for students' });
      }
      if (userClass === '12' && !stream) {
        return res.status(400).json({ success: false, message: 'Stream is required for Class 12 students' });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      board: role === 'student' ? board : null,
      class: role === 'student' ? userClass : null,
      stream: role === 'student' && userClass === '12' ? stream : null,
    });

    if (user) {
      // If student, initialize progress tracking
      if (user.role === 'student') {
        await Progress.create({ userId: user._id });
      }

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        board: user.board,
        class: user.class,
        stream: user.stream,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Manage daily login streak
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let currentStreak = user.streak;
      if (user.lastActiveDate) {
        const lastActiveStr = new Date(user.lastActiveDate).toDateString();
        if (lastActiveStr === yesterdayStr) {
          currentStreak += 1;
        } else if (lastActiveStr !== today) {
          currentStreak = 1; // Reset to 1 if missed a day
        }
      } else {
        currentStreak = 1;
      }

      user.streak = currentStreak;
      user.lastActiveDate = new Date();
      
      // Award XP for logging in
      user.xp += 10;
      
      // Check badges trigger
      if (user.streak >= 7 && !user.badges.includes('7-Day Streak')) {
        user.badges.push('7-Day Streak');
      }
      
      await user.save();

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        board: user.board,
        class: user.class,
        stream: user.stream,
        streak: user.streak,
        xp: user.xp,
        badges: user.badges,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin authentication with secret key check
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
export const adminLogin = async (req, res) => {
  const { email, password, secretKey } = req.body;

  try {
    const adminKey = process.env.ADMIN_SECRET_KEY || 'EduSphereAdmin2026';
    if (secretKey !== adminKey) {
      return res.status(401).json({ success: false, message: 'Unauthorized Access: Invalid Secret Admin Key' });
    }

    const user = await User.findOne({ email });

    if (user && user.role === 'admin' && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else if (user && user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Access denied: User is not an administrator' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
