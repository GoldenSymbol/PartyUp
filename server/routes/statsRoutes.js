const express = require('express');
const router = express.Router();
const {
  postsPerMonth,
  sessionsPerGame,
  usersByPlatform,
  requestsByStatus,
} = require('../controllers/statsController');

router.get('/posts-per-month', postsPerMonth);
router.get('/sessions-per-game', sessionsPerGame);
router.get('/users-by-platform', usersByPlatform);
router.get('/requests-by-status', requestsByStatus);

module.exports = router;
