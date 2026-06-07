import mongoose from 'mongoose';

const plotNodeSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
      index: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      default: null,
    },
    act: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Plot node title is required'],
      trim: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['idea', 'draft', 'done'],
      default: 'idea',
    },
    order: {
      type: Number,
      default: 0,
    },
    linkedCharacters: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }
    ],
  },
  { timestamps: true }
);

plotNodeSchema.index({ storyId: 1, act: 1, order: 1 });

const PlotNode = mongoose.model('PlotNode', plotNodeSchema);
export default PlotNode;
