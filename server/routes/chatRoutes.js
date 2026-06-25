const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:sessionId/messages', getMessages);
router.post('/:sessionId/messages', protect, sendMessage);

module.exports = router;
