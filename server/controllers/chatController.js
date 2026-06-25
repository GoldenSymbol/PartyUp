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

// POST /api/chat/:sessionId/messages  (protected)
async function sendMessage(req, res, next) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });
    const message = await ChatMessage.create({
      sessionId: req.params.sessionId,
      senderId: req.user._id,
      content,
    });
    const populated = await message.populate('senderId', 'username');

    // Broadcast over Socket.io too, so members connected via the live chat
    // room see REST-sent messages the same way as socket-sent ones.
    const io = req.app.get('io');
    if (io) io.to(`session:${req.params.sessionId}`).emit('receiveMessage', populated);

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMessages, sendMessage };
