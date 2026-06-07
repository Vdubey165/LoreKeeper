import express from 'express';
import {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getStories).post(createStory);
router.route('/:id').get(getStory).put(updateStory).delete(deleteStory);

export default router;
