const express = require('express');
const router = express.Router();
const { listPosts, getPost } = require('../controllers/postController');

router.get('/', listPosts);
router.get('/:id', getPost);

module.exports = router;
