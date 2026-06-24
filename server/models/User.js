const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    region: { type: String, default: '' },
    platform: { type: String, default: '' },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    favoriteGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    role: { type: String, enum: ['regular', 'host'], default: 'regular' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
