const express = require('express');
const router = express.Router();
const {
  listSessions, searchSessions, getSession,
  createSession, updateSession, deleteSession,
  joinSession, leaveSession, removeMember,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// NB: /search must be registered before /:id, otherwise Express would
// treat "search" as a session id and 404/cast-error on it.
router.get('/search', searchSessions);
router.get('/', listSessions);
router.post('/', protect, createSession);
router.get('/:id', getSession);
router.put('/:id', protect, updateSession);
router.delete('/:id', protect, deleteSession);
router.post('/:id/join', protect, joinSession);
router.post('/:id/leave', protect, leaveSession);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;
