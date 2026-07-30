// backfillWordCounts.js
//
// One-time script to fix existing Chapter/Story documents whose `wordCount`
// was never calculated (e.g. anything created before the Chapter.js /
// chapterController.js fix, or content inserted directly via seed.js).
//
// Safe to run multiple times — it just recomputes from plainText each time.
//
// Usage:
//   node backfillWordCounts.js
//
// Make sure MONGO_URI is available (this loads server/.env automatically).

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import Chapter from './models/Chapter.js';
import Story from './models/Story.js';

const computeWordCount = (plainText) => {
  const trimmed = (plainText || '').trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not found. Make sure server/.env has it set.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB.');

  const chapters = await Chapter.find({});
  console.log(`Found ${chapters.length} chapters. Recomputing word counts...`);

  let changedChapters = 0;
  for (const chapter of chapters) {
    const correctCount = computeWordCount(chapter.plainText);
    if (chapter.wordCount !== correctCount) {
      chapter.wordCount = correctCount;
      // Use updateOne instead of .save() here to skip the pre('save') hook
      // re-running redundantly — we've already computed the correct value.
      await Chapter.updateOne({ _id: chapter._id }, { wordCount: correctCount });
      changedChapters += 1;
    }
  }
  console.log(`Updated ${changedChapters} chapter(s).`);

  const storyIds = [...new Set(chapters.map((c) => c.storyId.toString()))];
  console.log(`Recalculating totals for ${storyIds.length} stories...`);

  let changedStories = 0;
  for (const storyId of storyIds) {
    const storyChapters = await Chapter.find({ storyId }, 'wordCount');
    const total = storyChapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);

    const story = await Story.findById(storyId);
    if (story && story.wordCount !== total) {
      story.wordCount = total;
      await story.save();
      changedStories += 1;
    }
  }
  console.log(`Updated ${changedStories} story/stories.`);

  console.log('Backfill complete.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});