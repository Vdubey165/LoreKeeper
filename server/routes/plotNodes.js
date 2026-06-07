import express from 'express';
import {
  getPlotNodes,
  createPlotNode,
  updatePlotNode,
  deletePlotNode,
  reorderPlotNodes,
} from '../controllers/plotNodeController.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route('/').get(getPlotNodes).post(createPlotNode);
router.post('/reorder', reorderPlotNodes);
router.route('/:id').put(updatePlotNode).delete(deletePlotNode);

export default router;
