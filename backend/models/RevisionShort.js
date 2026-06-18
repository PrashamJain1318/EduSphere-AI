import mongoose from 'mongoose';

const revisionShortSchema = new mongoose.Schema({
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
  videoUrl: {
    type: String,
    required: true, // YouTube Shorts url or direct video url
  },
  duration: {
    type: Number, // in seconds, e.g. 45
    default: 30,
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

const RevisionShort = mongoose.model('RevisionShort', revisionShortSchema);
export default RevisionShort;
