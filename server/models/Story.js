import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Story title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    genre: {
      type: String,
      enum: ['fantasy', 'sci-fi', 'thriller', 'mystery', 'romance', 'horror', 'drama', 'historical', 'other'],
      default: 'other',
    },
    coverImage: {
      type: String,
      default: null,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);
export default Story;
