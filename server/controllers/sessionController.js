const Session = require('../models/Session');

const POPULATE = [
  { path: 'gameId', select: 'name genre' },
  { path: 'hostId', select: 'username' },
  { path: 'members', select: 'username' },
];

function isHost(session, userId) {
  return session.hostId.toString() === userId.toString();
}

// GET /api/sessions
async function listSessions(req, res, next) {
  try {
    const sessions = await Session.find().populate(POPULATE);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

// GET /api/sessions/search?game=&platform=&region=&skillLevel=&mode=&status=&availability=open
async function searchSessions(req, res, next) {
  try {
    const { game, platform, region, skillLevel, mode, status, availability } = req.query;
    const filter = {};
    if (game) filter.gameId = game; // Game _id
    if (platform) filter.platform = platform;
    if (region) filter.region = region;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (mode) filter.mode = mode;
    if (status) filter.status = status;
    if (availability === 'open') {
      filter.$expr = { $lt: [{ $size: '$members' }, '$maxPlayers'] };
    }

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

// POST /api/sessions  (protected) — creator becomes host + first member
async function createSession(req, res, next) {
  try {
    const { title, gameId, platform, region, mode, skillLevel, description, maxPlayers, privacy, startTime } = req.body;
    if (!title || !gameId || !maxPlayers) {
      return res.status(400).json({ error: 'title, gameId and maxPlayers are required' });
    }
    const session = await Session.create({
      title, gameId, platform, region, mode, skillLevel, description, maxPlayers,
      privacy: privacy || 'public', startTime: startTime || 'Flexible',
      hostId: req.user._id, members: [req.user._id], status: 'open',
    });
    const populated = await session.populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

// PUT /api/sessions/:id  (protected, host only)
async function updateSession(req, res, next) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!isHost(session, req.user._id)) return res.status(403).json({ error: 'Only the host can edit this session' });

    const editable = ['title', 'platform', 'region', 'mode', 'skillLevel', 'description', 'maxPlayers', 'privacy', 'status', 'startTime'];
    editable.forEach((key) => {
      if (req.body[key] !== undefined) session[key] = req.body[key];
    });
    await session.save();
    const populated = await session.populate(POPULATE);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/sessions/:id  (protected, host only)
async function deleteSession(req, res, next) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!isHost(session, req.user._id)) return res.status(403).json({ error: 'Only the host can delete this session' });

    await session.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/sessions/:id/join  (protected) — public sessions only; private sessions use join requests
async function joinSession(req, res, next) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.privacy === 'private') {
      return res.status(400).json({ error: 'This session is private — send a join request instead' });
    }
    if (session.members.length >= session.maxPlayers) {
      return res.status(400).json({ error: 'This session is already full' });
    }
    if (!session.members.some((m) => m.toString() === req.user._id.toString())) {
      session.members.push(req.user._id);
      if (session.members.length >= session.maxPlayers) session.status = 'full';
      await session.save();
    }
    const populated = await session.populate(POPULATE);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// POST /api/sessions/:id/leave  (protected)
async function leaveSession(req, res, next) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.members = session.members.filter((m) => m.toString() !== req.user._id.toString());
    if (session.status === 'full' && session.members.length < session.maxPlayers) session.status = 'open';
    await session.save();
    const populated = await session.populate(POPULATE);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/sessions/:id/members/:userId  (protected, host only)
async function removeMember(req, res, next) {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!isHost(session, req.user._id)) return res.status(403).json({ error: 'Only the host can remove members' });

    session.members = session.members.filter((m) => m.toString() !== req.params.userId);
    if (session.status === 'full' && session.members.length < session.maxPlayers) session.status = 'open';
    await session.save();
    const populated = await session.populate(POPULATE);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSessions, searchSessions, getSession,
  createSession, updateSession, deleteSession,
  joinSession, leaveSession, removeMember,
};
