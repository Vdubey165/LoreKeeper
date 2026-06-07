import express from 'express';
import {
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
} from '../controllers/chapterController.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/').get(getChapters).post(createChapter);
router.post('/reorder', reorderChapters);
router.route('/:id').get(getChapter).put(updateChapter).delete(deleteChapter);

export default router;
