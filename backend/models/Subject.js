import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  code: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
