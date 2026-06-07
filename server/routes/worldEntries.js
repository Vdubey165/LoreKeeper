import express from 'express';
import {
  getWorldEntries,
  getWorldEntry,
  createWorldEntry,
  updateWorldEntry,
  deleteWorldEntry,
} from '../controllers/worldEntryController.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/').get(getWorldEntries).post(createWorldEntry);
router.route('/:id').get(getWorldEntry).put(updateWorldEntry).delete(deleteWorldEntry);

export default router;
