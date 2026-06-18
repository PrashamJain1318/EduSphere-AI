import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  class: {
    type: String,
    enum: ['10', '12'],
    required: true,
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce', 'Humanities', null],
    default: null,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    // Required only for chapter-specific content (notes, videos, pyqs, shorts)
    required: function() {
      return ['notes', 'video', 'pyq'].includes(this.resourceType);
    }
  },
  resourceType: {
    type: String,
    enum: ['notes', 'video', 'pyq', 'paper', 'short'],
    required: true,
  },
  videoUrl: {
    type: String,
  },
  youtubeVideoId: {
    type: String,
  },
  pdfUrl: {
    type: String,
  },
  solutionPdfUrl: {
    type: String,
    default: '',
  },
  board: {
    type: String,
    enum: ['CBSE', 'ICSE', 'State Board', null],
    default: null,
  },
  year: {
    type: Number,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
