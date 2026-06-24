const mongoose = require('mongoose');
const { Schema } = mongoose;

const joinRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    message: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
