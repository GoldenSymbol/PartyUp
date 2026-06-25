const express = require('express');
const router = express.Router();
const { listUsers, getUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', protect, updateUser);

module.exports = router;
