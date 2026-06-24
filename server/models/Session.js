const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, default: '' },
    region: { type: String, default: '' },
    mode: { type: String, enum: ['duo', 'squad', 'custom'], default: 'duo' },
    skillLevel: { type: String, default: '' },
    description: { type: String, default: '' },
    maxPlayers: { type: Number, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    privacy: { type: String, enum: ['public', 'private'], default: 'public' },
    status: { type: String, enum: ['open', 'full', 'closed'], default: 'open' },
    startTime: { type: String, default: 'Flexible' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
