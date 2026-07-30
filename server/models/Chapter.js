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

// Auto-compute wordCount whenever plainText changes, no matter which code
// path wrote it (API create/update, seed script, future admin tools, etc.)
// This keeps wordCount self-maintaining instead of relying on every caller
// to calculate and pass it in manually.
const computeWordCount = (plainText) => {
  const trimmed = (plainText || '').trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

// Covers Chapter.create() / document.save()
chapterSchema.pre('save', function (next) {
  if (this.isModified('plainText')) {
    this.wordCount = computeWordCount(this.plainText);
  }
  next();
});

// Covers Chapter.findOneAndUpdate() / findByIdAndUpdate() — these do NOT run
// document middleware, so plainText -> wordCount must be synced separately here.
chapterSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && Object.prototype.hasOwnProperty.call(update, 'plainText')) {
    update.wordCount = computeWordCount(update.plainText);
  }
  next();
});

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;