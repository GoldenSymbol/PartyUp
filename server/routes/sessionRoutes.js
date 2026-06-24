const express = require('express');
const router = express.Router();
const { listSessions, searchSessions, getSession } = require('../controllers/sessionController');

// NB: /search must be registered before /:id, otherwise Express would
// treat "search" as a session id and 404/cast-error on it.
router.get('/search', searchSessions);
router.get('/', listSessions);
router.get('/:id', getSession);

module.exports = router;
