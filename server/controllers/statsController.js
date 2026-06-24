const Post = require('../models/Post');
const Session = require('../models/Session');
const User = require('../models/User');
const JoinRequest = require('../models/JoinRequest');

// GET /api/stats/posts-per-month
async function postsPerMonth(req, res, next) {
  try {
    const data = await Post.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $project: { _id: 0, month: '$_id', count: 1 } },
      { $sort: { month: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/stats/sessions-per-game
async function sessionsPerGame(req, res, next) {
  try {
    const data = await Session.aggregate([
      { $group: { _id: '$gameId', count: { $sum: 1 } } },
      { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
      { $unwind: { path: '$game', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, gameId: '$_id', game: '$game.name', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/stats/users-by-platform
async function usersByPlatform(req, res, next) {
  try {
    const data = await User.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
      { $project: { _id: 0, platform: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/stats/requests-by-status
async function requestsByStatus(req, res, next) {
  try {
    const data = await JoinRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
      { $sort: { status: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { postsPerMonth, sessionsPerGame, usersByPlatform, requestsByStatus };
