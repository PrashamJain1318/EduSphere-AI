import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  notesRead: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  }],
  videosWatched: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  }],
  completedChapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  studyTime: {
    type: Number, // in minutes
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
