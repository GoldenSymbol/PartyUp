const Post = require('../models/Post');

// GET /api/posts
async function listPosts(req, res, next) {
  try {
    const posts = await Post.find()
      .populate('authorId', 'username')
      .populate('sessionId', 'title')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

// GET /api/posts/:id
async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username')
      .populate('sessionId', 'title');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

module.exports = { listPosts, getPost };
