import mongoose from 'mongoose';

const videoProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  watchTime: {
    type: Number, // in seconds
    default: 0,
  },
  watchPercentage: {
    type: Number, // 0 to 100
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure uniqueness per user-video pair
videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

const VideoProgress = mongoose.model('VideoProgress', videoProgressSchema);
export default VideoProgress;
