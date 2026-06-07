import WorldEntry from '../models/WorldEntry.js';
import Story from '../models/Story.js';

const verifyStoryOwnership = async (storyId, userId) => {
  const story = await Story.findOne({ _id: storyId, userId });
  return !!story;
};

export const getWorldEntries = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { type } = req.query;

    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const filter = { storyId };
    if (type) filter.type = type;

    const entries = await WorldEntry.find(filter).sort({ type: 1, title: 1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const getWorldEntry = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const entry = await WorldEntry.findOne({ _id: id, storyId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const createWorldEntry = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const entry = await WorldEntry.create({ storyId, ...req.body });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const updateWorldEntry = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const entry = await WorldEntry.findOneAndUpdate(
      { _id: id, storyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteWorldEntry = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const entry = await WorldEntry.findOneAndDelete({ _id: id, storyId });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};
