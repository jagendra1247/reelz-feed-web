const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  text:      { type: String, required: true, maxlength: 500 },
  userId:    { type: String, required: true },
  username:  { type: String, default: 'Anonymous' },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
