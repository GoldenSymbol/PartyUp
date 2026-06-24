const Game = require('../models/Game');

// GET /api/games
async function listGames(req, res, next) {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    next(err);
  }
}

// GET /api/games/:id
async function getGame(req, res, next) {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    next(err);
  }
}

module.exports = { listGames, getGame };
