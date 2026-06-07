import PlotNode from '../models/PlotNode.js';
import Story from '../models/Story.js';

const verifyStoryOwnership = async (storyId, userId) => {
  const story = await Story.findOne({ _id: storyId, userId });
  return !!story;
};

export const getPlotNodes = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const nodes = await PlotNode.find({ storyId }).sort({ act: 1, order: 1 });
    res.json(nodes);
  } catch (error) {
    next(error);
  }
};

export const createPlotNode = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const node = await PlotNode.create({ storyId, ...req.body });
    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
};

export const updatePlotNode = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const node = await PlotNode.findOneAndUpdate(
      { _id: id, storyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!node) return res.status(404).json({ message: 'Plot node not found' });

    res.json(node);
  } catch (error) {
    next(error);
  }
};

export const deletePlotNode = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const node = await PlotNode.findOneAndDelete({ _id: id, storyId });
    if (!node) return res.status(404).json({ message: 'Plot node not found' });

    res.json({ message: 'Plot node deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderPlotNodes = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { orderedIds } = req.body;

    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = orderedIds.map((id, index) =>
      PlotNode.findOneAndUpdate({ _id: id, storyId }, { order: index })
    );
    await Promise.all(updates);

    res.json({ message: 'Plot nodes reordered' });
  } catch (error) {
    next(error);
  }
};
