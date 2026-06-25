const User = require('../models/User');

// GET /api/users?q=&region=&platform=&skillLevel=&favoriteGame=
async function listUsers(req, res, next) {
  try {
    const { q, region, platform, skillLevel, favoriteGame } = req.query;
    const filter = {};
    if (q) filter.username = { $regex: q, $options: 'i' };
    if (region) filter.region = region;
    if (platform) filter.platform = platform;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (favoriteGame) filter.favoriteGames = favoriteGame;

    const users = await User.find(filter).select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id  (protected, own profile only)
async function updateUser(req, res, next) {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'You can only edit your own profile' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { username, bio, avatarUrl, region, platform, skillLevel, favoriteGames } = req.body;
    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) return res.status(400).json({ error: 'Username is already taken' });
      user.username = username;
    }
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (region !== undefined) user.region = region;
    if (platform !== undefined) user.platform = platform;
    if (skillLevel !== undefined) user.skillLevel = skillLevel;
    if (favoriteGames !== undefined) user.favoriteGames = favoriteGames;

    await user.save();
    res.json(await User.findById(user._id).select('-passwordHash'));
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, updateUser };
