// Real-time chat over Socket.io (spec section 17/28) — REST under /api/chat
// still loads message history; this is the live send/broadcast path.
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Session = require('./models/Session');
const ChatMessage = require('./models/ChatMessage');

function roomName(sessionId) {
  return `session:${sessionId}`;
}

async function isSessionMember(sessionId, userId) {
  const session = await Session.findById(sessionId);
  if (!session) return false;
  return session.members.some((m) => m.toString() === userId.toString());
}

function initSocket(io) {
  // Auth handshake mirrors authMiddleware.protect — same JWT, same secret.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) return next(new Error('Not authorized — missing token'));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-passwordHash');
      if (!user) return next(new Error('Not authorized — user no longer exists'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Not authorized — invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', async (sessionId) => {
      try {
        if (!(await isSessionMember(sessionId, socket.user._id))) {
          return socket.emit('chatError', { error: 'Only session members can join this chat' });
        }
        socket.join(roomName(sessionId));
      } catch (err) {
        socket.emit('chatError', { error: 'Could not join chat room' });
      }
    });

    socket.on('leaveRoom', (sessionId) => {
      socket.leave(roomName(sessionId));
    });

    socket.on('sendMessage', async ({ sessionId, content } = {}) => {
      try {
        if (!content) return socket.emit('chatError', { error: 'content is required' });
        if (!(await isSessionMember(sessionId, socket.user._id))) {
          return socket.emit('chatError', { error: 'Only session members can send messages' });
        }
        const message = await ChatMessage.create({ sessionId, senderId: socket.user._id, content });
        const populated = await message.populate('senderId', 'username');
        io.to(roomName(sessionId)).emit('receiveMessage', populated);
      } catch (err) {
        socket.emit('chatError', { error: 'Could not send message' });
      }
    });
  });
}

module.exports = { initSocket, roomName };
