const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the "Authorization: Bearer <token>" header and attaches req.user.
async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authorized — missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'Not authorized — user no longer exists' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized — invalid or expired token' });
  }
}

module.exports = { protect };
