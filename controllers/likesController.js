const Like = require('../models/Like');

// POST /api/likes
exports.toggleLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    if (!postId || !userId) return res.status(400).json({ error: 'postId and userId required' });

    const existing = await Like.findOne({ postId, userId });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      const count = await Like.countDocuments({ postId });
      return res.json({ liked: false, count });
    }

    await Like.create({ postId, userId });
    const count = await Like.countDocuments({ postId });
    res.json({ liked: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// GET /api/likes/:postId
exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const count  = await Like.countDocuments({ postId });
    const liked  = userId ? !!(await Like.findOne({ postId, userId })) : false;
    res.json({ count, liked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get likes' });
  }
};
