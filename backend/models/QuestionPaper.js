import mongoose from 'mongoose';

const questionPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  board: {
    type: String,
    enum: ['CBSE', 'ICSE', 'State Board'],
    required: true,
  },
  class: {
    type: String,
    enum: ['10', '12'],
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  solutionPdfUrl: {
    type: String,
    default: '',
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

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
export default QuestionPaper;
