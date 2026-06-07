import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Tiptap stores content as JSON
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Plain text version for word count + AI context building
    plainText: {
      type: String,
      default: '',
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['idea', 'draft', 'revised', 'done'],
      default: 'draft',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

chapterSchema.index({ storyId: 1, order: 1 });

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;
