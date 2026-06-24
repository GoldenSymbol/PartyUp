const express = require('express');
const router = express.Router();
const { listGames, getGame } = require('../controllers/gameController');

router.get('/', listGames);
router.get('/:id', getGame);

module.exports = router;
