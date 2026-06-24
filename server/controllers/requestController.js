const JoinRequest = require('../models/JoinRequest');

const POPULATE = [
  { path: 'userId', select: 'username' },
  { path: 'sessionId', select: 'title' },
];

// GET /api/requests
async function listRequests(req, res, next) {
  try {
    const requests = await JoinRequest.find().populate(POPULATE);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

// GET /api/requests/my?userId=<id>
// Phase 1 has no auth/session wiring yet, so the caller identifies the user
// via a userId query param. Swap this for req.user.id once auth exists.
async function myRequests(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId query parameter is required' });
    const requests = await JoinRequest.find({ userId }).populate(POPULATE);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

// GET /api/requests/session/:sessionId
async function requestsForSession(req, res, next) {
  try {
    const requests = await JoinRequest.find({ sessionId: req.params.sessionId }).populate(POPULATE);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

module.exports = { listRequests, myRequests, requestsForSession };
