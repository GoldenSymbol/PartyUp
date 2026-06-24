const express = require('express');
const router = express.Router();
const { listUsers, getUser } = require('../controllers/userController');

router.get('/', listUsers);
router.get('/:id', getUser);

module.exports = router;
