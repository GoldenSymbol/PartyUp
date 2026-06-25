const Post = require('../models/Post');
const Session = require('../models/Session');
const User = require('../models/User');

const POPULATE = [
  { path: 'authorId', select: 'username' },
  { path: 'sessionId', select: 'title' },
];

// GET /api/posts?sessionId=&feedFor=<userId>
async function listPosts(req, res, next) {
  try {
    const { sessionId, feedFor } = req.query;

    if (feedFor) {
      // Home feed: posts from sessions the user joined, public sessions, or
      // sessions about one of the user's favorite games (mirrors the same
      // rule the mock apiClient.jsx used before the backend existed).
      const user = await User.findById(feedFor);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const mySessions = await Session.find({ members: feedFor }).select('_id');
      const mySessionIds = mySessions.map((s) => s._id.toString());
      const favoriteGameIds = (user.favoriteGames || []).map((g) => g.toString());

      const candidateSessions = await Session.find({
        $or: [{ privacy: 'public' }, { _id: { $in: mySessionIds } }, { gameId: { $in: favoriteGameIds } }],
      }).select('_id');
      const candidateIds = candidateSessions.map((s) => s._id);

      const posts = await Post.find({ sessionId: { $in: candidateIds } }).populate(POPULATE).sort({ createdAt: -1 });
      return res.json(posts);
    }

    const filter = {};
    if (sessionId) filter.sessionId = sessionId;
    const posts = await Post.find(filter).populate(POPULATE).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

// GET /api/posts/:id
async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate(POPULATE);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

// POST /api/posts  (protected)
async function createPost(req, res, next) {
  try {
    const { sessionId, content } = req.body;
    if (!sessionId || !content) return res.status(400).json({ error: 'sessionId and content are required' });
    const post = await Post.create({ authorId: req.user._id, sessionId, content });
    const populated = await post.populate(POPULATE);
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

// PUT /api/posts/:id  (protected, author only)
async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own posts' });
    }
    if (req.body.content !== undefined) post.content = req.body.content;
    await post.save();
    const populated = await post.populate(POPULATE);
    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/posts/:id  (protected, author only)
async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }
    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
