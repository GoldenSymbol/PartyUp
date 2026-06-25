const express = require('express');
const router = express.Router();
const { listGames, getGame, createGame, updateGame, deleteGame } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', listGames);
router.post('/', protect, createGame);
router.get('/:id', getGame);
router.put('/:id', protect, updateGame);
router.delete('/:id', protect, deleteGame);

module.exports = router;
