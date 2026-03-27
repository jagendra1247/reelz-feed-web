const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  videoUrl:    { type: String, required: true },
  thumbnailUrl:{ type: String, default: '' },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  tags:        [String],
  source:      { type: String, default: 'manual' }, // 'bunny' | 'manual'
  bunnyId:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
