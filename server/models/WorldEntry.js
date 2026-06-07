import mongoose from 'mongoose';

const worldEntrySchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['location', 'faction', 'lore', 'item', 'event', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Entry title is required'],
      trim: true,
    },
    body: {
      type: String,
      default: '',
    },
    tags: [{ type: String, trim: true }],
    linkedCharacters: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }
    ],
  },
  { timestamps: true }
);

worldEntrySchema.index({ storyId: 1, type: 1 });

const WorldEntry = mongoose.model('WorldEntry', worldEntrySchema);
export default WorldEntry;
