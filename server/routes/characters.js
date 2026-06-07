import express from 'express';
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from '../controllers/characterController.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/').get(getCharacters).post(createCharacter);
router.route('/:id').get(getCharacter).put(updateCharacter).delete(deleteCharacter);

export default router;
