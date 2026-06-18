import mongoose from 'mongoose';

const videoReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const videoCommentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [videoReplySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const VideoComment = mongoose.model('VideoComment', videoCommentSchema);
export default VideoComment;
