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

module.exports = { listUsers, getUser };
