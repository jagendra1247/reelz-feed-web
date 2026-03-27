const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: String, required: true }, // random session-based ID
}, { timestamps: true });

// One like per user per post
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);
