import Doubt from '../models/Doubt.js';
import User from '../models/User.js';

/**
 * Ask a new doubt
 */
export const askDoubt = async (req, res) => {
  const { title, description } = req.body;
  try {
    const doubt = await Doubt.create({
      title,
      description,
      authorId: req.user._id,
    });
    const populated = await Doubt.findById(doubt._id).populate('authorId', 'name role profilePicture');
    res.status(201).json({ success: true, doubt: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all doubts with optional search
 */
export const getDoubts = async (req, res) => {
  const { search } = req.query;
  try {
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const doubts = await Doubt.find(filter)
      .populate('authorId', 'name role profilePicture')
      .populate('answers.authorId', 'name role profilePicture')
      .sort({ createdAt: -1 });

    res.json({ success: true, doubts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get doubt by ID
 */
export const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('authorId', 'name role profilePicture')
      .populate('answers.authorId', 'name role profilePicture');

    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }
    res.json({ success: true, doubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upvote a doubt
 */
export const upvoteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    const userId = req.user._id;
    const isUpvoted = doubt.upvotes.includes(userId);

    if (isUpvoted) {
      doubt.upvotes = doubt.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      doubt.upvotes.push(userId);
    }

    await doubt.save();
    res.json({ success: true, upvotesCount: doubt.upvotes.length, isUpvoted: !isUpvoted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Answer a doubt
 */
export const answerDoubt = async (req, res) => {
  const { text } = req.body;
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    const isTeacher = req.user.role === 'teacher' || req.user.role === 'admin';

    doubt.answers.push({
      authorId: req.user._id,
      text,
      isTeacherVerified: isTeacher,
      upvotes: [],
    });

    await doubt.save();
    const updated = await Doubt.findById(req.params.id)
      .populate('authorId', 'name role profilePicture')
      .populate('answers.authorId', 'name role profilePicture');

    // Grant student user 10 XP if they reply to a doubt
    if (req.user.role === 'student') {
      const user = await User.findById(req.user._id);
      user.xp += 10;
      await user.save();
    }

    res.status(201).json({ success: true, doubt: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upvote an answer
 */
export const upvoteAnswer = async (req, res) => {
  const { doubtId, answerId } = req.params;
  try {
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    const answer = doubt.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: 'Answer not found' });
    }

    const userId = req.user._id;
    const isUpvoted = answer.upvotes.includes(userId);

    if (isUpvoted) {
      answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId.toString());
    } else {
      answer.upvotes.push(userId);
    }

    await doubt.save();
    res.json({ success: true, upvotesCount: answer.upvotes.length, isUpvoted: !isUpvoted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
