const Session = require('../models/Session');

const POPULATE = [
  { path: 'gameId', select: 'name genre' },
  { path: 'hostId', select: 'username' },
  { path: 'members', select: 'username' },
];

// GET /api/sessions
async function listSessions(req, res, next) {
  try {
    const sessions = await Session.find().populate(POPULATE);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

// GET /api/sessions/search?game=&platform=&region=&skillLevel=&mode=&status=
async function searchSessions(req, res, next) {
  try {
    const { game, platform, region, skillLevel, mode, status } = req.query;
    const filter = {};
    if (game) filter.gameId = game; // expects a Game _id
    if (platform) filter.platform = platform;
    if (region) filter.region = region;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (mode) filter.mode = mode;
    if (status) filter.status = status;

    const sessions = await Session.find(filter).populate(POPULATE);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

// GET /api/sessions/:id
async function getSession(req, res, next) {
  try {
    const session = await Session.findById(req.params.id).populate(POPULATE);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
}

module.exports = { listSessions, searchSessions, getSession };
