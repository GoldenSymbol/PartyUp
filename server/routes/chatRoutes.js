const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chatController');

router.get('/:sessionId/messages', getMessages);

module.exports = router;
