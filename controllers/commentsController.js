const Comment = require('../models/Comment');

// POST /api/comments
exports.addComment = async (req, res) => {
  try {
    const { postId, text, userId, username } = req.body;
    if (!postId || !text || !userId) return res.status(400).json({ error: 'postId, text, userId required' });

    const comment = await Comment.create({ postId, text: text.trim(), userId, username: username || 'Anonymous' });
    const count   = await Comment.countDocuments({ postId });
    res.status(201).json({ comment, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// GET /api/comments/:postId
exports.getComments = async (req, res) => {
  try {
    const { postId }  = req.params;
    const page        = parseInt(req.query.page)  || 1;
    const limit       = parseInt(req.query.limit) || 20;
    const skip        = (page - 1) * limit;

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const count    = await Comment.countDocuments({ postId });
    res.json({ comments, count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get comments' });
  }
};
