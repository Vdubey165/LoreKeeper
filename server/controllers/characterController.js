import Character from '../models/Character.js';
import Story from '../models/Story.js';

const verifyStoryOwnership = async (storyId, userId) => {
  const story = await Story.findOne({ _id: storyId, userId });
  return !!story;
};

export const getCharacters = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const characters = await Character.find({ storyId }).sort({ name: 1 });
    res.json(characters);
  } catch (error) {
    next(error);
  }
};

export const getCharacter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const character = await Character.findOne({ _id: id, storyId });
    if (!character) return res.status(404).json({ message: 'Character not found' });

    res.json(character);
  } catch (error) {
    next(error);
  }
};

export const createCharacter = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const character = await Character.create({ storyId, ...req.body });
    res.status(201).json(character);
  } catch (error) {
    next(error);
  }
};

export const updateCharacter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const character = await Character.findOneAndUpdate(
      { _id: id, storyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!character) return res.status(404).json({ message: 'Character not found' });

    res.json(character);
  } catch (error) {
    next(error);
  }
};

export const deleteCharacter = async (req, res, next) => {
  try {
    const { storyId, id } = req.params;
    if (!(await verifyStoryOwnership(storyId, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const character = await Character.findOneAndDelete({ _id: id, storyId });
    if (!character) return res.status(404).json({ message: 'Character not found' });

    res.json({ message: 'Character deleted' });
  } catch (error) {
    next(error);
  }
};
