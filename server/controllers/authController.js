const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.passwordHash;
  return obj;
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { username, email, password, region, platform, skillLevel, favoriteGames } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ error: 'Username or email already in use' });

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username, email, passwordHash, region, platform, skillLevel,
      favoriteGames: favoriteGames || [], role: 'regular',
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login  — body: { identifier, password } where identifier is email or username
async function login(req, res, next) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'identifier and password are required' });
    }
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (protected)
async function me(req, res) {
  res.json(publicUser(req.user));
}

module.exports = { register, login, me };
