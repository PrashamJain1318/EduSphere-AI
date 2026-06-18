import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  youtubeVideoId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['lectures', 'pyqs', 'numericals', 'shorts'],
    default: 'lectures',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  class: {
    type: String,
    enum: ['10', '12', null],
    default: null,
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce', 'Humanities', null],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
