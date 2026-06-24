const express = require('express');
const router = express.Router();
const { listRequests, myRequests, requestsForSession } = require('../controllers/requestController');

router.get('/my', myRequests);
router.get('/session/:sessionId', requestsForSession);
router.get('/', listRequests);

module.exports = router;
