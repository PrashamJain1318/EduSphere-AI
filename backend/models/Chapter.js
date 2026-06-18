import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  section: {
    type: String,
    enum: ['First Flight', 'Poems', 'Footprints Without Feet', null],
    default: null,
  },
  order: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;
