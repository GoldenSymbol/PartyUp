const Game = require('../models/Game');

// GET /api/games?q=
async function listGames(req, res, next) {
  try {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const games = await Game.find(filter);
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

// POST /api/games  (protected, hosts only — spec 6.2/11.2)
async function createGame(req, res, next) {
  try {
    if (req.user.role !== 'host') return res.status(403).json({ error: 'Only hosts can add games' });
    const { name, genre, imageUrl, platforms, description, popularityScore } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const game = await Game.create({ name, genre, imageUrl, platforms, description, popularityScore });
    res.status(201).json(game);
  } catch (err) {
    next(err);
  }
}

// PUT /api/games/:id  (protected, hosts only)
async function updateGame(req, res, next) {
  try {
    if (req.user.role !== 'host') return res.status(403).json({ error: 'Only hosts can edit games' });
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const editable = ['name', 'genre', 'imageUrl', 'platforms', 'description', 'popularityScore'];
    editable.forEach((key) => {
      if (req.body[key] !== undefined) game[key] = req.body[key];
    });
    await game.save();
    res.json(game);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/games/:id  (protected, hosts only)
async function deleteGame(req, res, next) {
  try {
    if (req.user.role !== 'host') return res.status(403).json({ error: 'Only hosts can delete games' });
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    await game.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listGames, getGame, createGame, updateGame, deleteGame };
