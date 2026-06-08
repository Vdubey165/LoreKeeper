import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, passwordHash: password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const user = await (await import('../models/User.js')).default.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (name) user.name = name
    if (email && email !== user.email) {
      const exists = await (await import('../models/User.js')).default.findOne({ email })
      if (exists) return res.status(400).json({ message: 'Email already in use' })
      user.email = email
    }
    await user.save()
    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch (error) { next(error) }
}

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await (await import('../models/User.js')).default.findById(req.user._id).select('+passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.passwordHash = newPassword
    await user.save()
    res.json({ message: 'Password updated' })
  } catch (error) { next(error) }
}

export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body
    const User = (await import('../models/User.js')).default
    const user = await User.findById(req.user._id).select('+passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Password is incorrect' })
    }
    const Story = (await import('../models/Story.js')).default
    const stories = await Story.find({ userId: req.user._id })
    const storyIds = stories.map(s => s._id)
    const [Chapter, Character, WorldEntry, PlotNode] = await Promise.all([
      import('../models/Chapter.js').then(m => m.default),
      import('../models/Character.js').then(m => m.default),
      import('../models/WorldEntry.js').then(m => m.default),
      import('../models/PlotNode.js').then(m => m.default),
    ])
    await Promise.all([
      Chapter.deleteMany({ storyId: { $in: storyIds } }),
      Character.deleteMany({ storyId: { $in: storyIds } }),
      WorldEntry.deleteMany({ storyId: { $in: storyIds } }),
      PlotNode.deleteMany({ storyId: { $in: storyIds } }),
      Story.deleteMany({ userId: req.user._id }),
      User.findByIdAndDelete(req.user._id),
    ])
    res.json({ message: 'Account deleted' })
  } catch (error) { next(error) }
}