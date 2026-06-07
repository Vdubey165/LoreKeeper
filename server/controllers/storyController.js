import Story from '../models/Story.js';

export const getStories = async (req, res, next) => {
  try {
    const stories = await Story.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(stories);
  } catch (error) {
    next(error);
  }
};

export const getStory = async (req, res, next) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    next(error);
  }
};

export const createStory = async (req, res, next) => {
  try {
    const { title, description, genre, coverImage } = req.body;

    const story = await Story.create({
      userId: req.user._id,
      title,
      description,
      genre,
      coverImage,
    });

    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
};

export const updateStory = async (req, res, next) => {
  try {
    const story = await Story.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // TODO: cascade delete chapters, characters, worldEntries, plotNodes
    res.json({ message: 'Story deleted' });
  } catch (error) {
    next(error);
  }
};
