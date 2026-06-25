const JoinRequest = require('../models/JoinRequest');
const Session = require('../models/Session');

const POPULATE = [
  { path: 'userId', select: 'username' },
  { path: 'sessionId', select: 'title hostId' },
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

// GET /api/requests/my  (protected — uses the logged-in user from the JWT)
async function myRequests(req, res, next) {
  try {
    const requests = await JoinRequest.find({ userId: req.user._id }).populate(POPULATE);
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

// POST /api/requests  (protected) — body: { sessionId, message }
async function createRequest(req, res, next) {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

    const existing = await JoinRequest.findOne({ sessionId, userId: req.user._id, status: 'pending' });
    if (existing) {
      const populated = await existing.populate(POPULATE);
      return res.status(200).json(populated);
    }

    const request = await JoinRequest.create({ sessionId, userId: req.user._id, message, status: 'pending' });
    const populated = await request.populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

async function setStatus(req, res, next, status) {
  try {
    const request = await JoinRequest.findById(req.params.id).populate('sessionId');
    if (!request) return res.status(404).json({ error: 'Join request not found' });

    const session = request.sessionId; // populated Session doc
    if (session.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the host of this session can do that' });
    }

    request.status = status;
    await request.save();

    if (status === 'approved') {
      const sessionDoc = await Session.findById(session._id);
      if (!sessionDoc.members.some((m) => m.toString() === request.userId.toString())) {
        sessionDoc.members.push(request.userId);
        if (sessionDoc.members.length >= sessionDoc.maxPlayers) sessionDoc.status = 'full';
        await sessionDoc.save();
      }
    }

    const populated = await JoinRequest.findById(request._id).populate([
      { path: 'userId', select: 'username' },
      { path: 'sessionId', select: 'title' },
    ]);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// PUT /api/requests/:id/approve  (protected, host of the session only)
function approveRequest(req, res, next) {
  return setStatus(req, res, next, 'approved');
}

// PUT /api/requests/:id/reject  (protected, host of the session only)
function rejectRequest(req, res, next) {
  return setStatus(req, res, next, 'rejected');
}

// DELETE /api/requests/:id  (protected — the requester can cancel their own request)
async function deleteRequest(req, res, next) {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Join request not found' });
    if (request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only cancel your own request' });
    }
    await request.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRequests, myRequests, requestsForSession,
  createRequest, approveRequest, rejectRequest, deleteRequest,
};
