import Chapter from '../models/Chapter.js';
import Story from '../models/Story.js';

const verifyStoryOwnership = async (storyId, userId) => {
  const story = await Story.findOne({ _id: storyId, userId });
  return story;
};

const recalcStoryWordCount = async (storyId) => {
  const chapters = await Chapter.find({ storyId }, 'wordCount');
  const total = chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
  await Story.findByIdAndUpdate(storyId, { wordCount: total });
};

export const getChapters = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const chapters = await Chapter.find({ storyId })
      .select('-content') // don't send full content on list view
      .sort({ order: 1 });
    res.json(chapters);
  } catch (error) {
    next(error);
  }
};

export const getChapter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const chapter = await Chapter.findOne({ _id: id, storyId });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const createChapter = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Place new chapter at end
    const lastChapter = await Chapter.findOne({ storyId }).sort({ order: -1 });
    const order = lastChapter ? lastChapter.order + 1 : 0;

    const chapter = await Chapter.create({ storyId, order, ...req.body });
    res.status(201).json(chapter);
  } catch (error) {
    next(error);
  }
};

export const updateChapter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const chapter = await Chapter.findOneAndUpdate(
      { _id: id, storyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    // Keep story word count in sync
    await recalcStoryWordCount(storyId);

    res.json(chapter);
  } catch (error) {
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const chapter = await Chapter.findOneAndDelete({ _id: id, storyId });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });

    await recalcStoryWordCount(storyId);
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderChapters = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { orderedIds } = req.body; // array of chapter IDs in new order

    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = orderedIds.map((id, index) =>
      Chapter.findOneAndUpdate({ _id: id, storyId }, { order: index })
    );
    await Promise.all(updates);

    res.json({ message: 'Chapters reordered' });
  } catch (error) {
    next(error);
  }
};
