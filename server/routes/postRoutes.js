const express = require('express');
const router = express.Router();
const { listPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', listPosts);
router.post('/', protect, createPost);
router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
