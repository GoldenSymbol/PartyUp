const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    genre: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    platforms: [{ type: String }],
    description: { type: String, default: '' },
    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
