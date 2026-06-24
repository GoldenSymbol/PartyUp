const ChatMessage = require('../models/ChatMessage');

// GET /api/chat/:sessionId/messages
async function getMessages(req, res, next) {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .populate('senderId', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages };
