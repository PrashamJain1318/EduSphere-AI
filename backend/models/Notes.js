import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
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
  description: {
    type: String,
    trim: true,
  },
  pdfUrl: {
    type: String,
    required: true,
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

const Notes = mongoose.model('Notes', notesSchema);
export default Notes;
