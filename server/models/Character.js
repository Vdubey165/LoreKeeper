import mongoose from 'mongoose';

const relationSchema = new mongoose.Schema({
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
  label: { type: String, trim: true }, // e.g. "rival", "mentor", "lover"
});

const characterSchema = new mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Character name is required'],
      trim: true,
    },
    aliases: [{ type: String, trim: true }],
    role: {
      type: String,
      enum: ['protagonist', 'antagonist', 'supporting', 'minor', 'other'],
      default: 'supporting',
    },
    traits: [{ type: String, trim: true }],
    backstory: {
      type: String,
      default: '',
    },
    appearance: {
      type: String,
      default: '',
    },
    motivations: {
      type: String,
      default: '',
    },
    relations: [relationSchema],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const Character = mongoose.model('Character', characterSchema);
export default Character;
