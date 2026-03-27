const Post   = require('../models/Post');
const Like    = require('../models/Like');
const Comment = require('../models/Comment');
const axios   = require('axios');

// Seed demo posts if DB is empty
const DEMO_POSTS = [
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        'Big Buck Bunny',
    description:  'A short open-source animated film',
    source:       'manual',
  },
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        "Elephant's Dream",
    description:  'The first open Blender movie',
    source:       'manual',
  },
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        'For Bigger Blazes',
    description:  'Exciting action footage',
    source:       'manual',
  },
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        'For Bigger Escapes',
    description:  'Adventure awaits',
    source:       'manual',
  },
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        'Subaru Outback',
    description:  'On street and dirt',
    source:       'manual',
  },
  {
    videoUrl:     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://i.imgur.com/4M34hi2.png',
    title:        'We Are Going On Bullrun',
    description:  'Rally adventure',
    source:       'manual',
  },
];

async function seedIfEmpty() {
  const count = await Post.countDocuments();
  if (count === 0) {
    await Post.insertMany(DEMO_POSTS);
    console.log('📦 Seeded demo posts');
  }
}

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    await seedIfEmpty();

    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    // Try to fetch from Bunny.net if configured
    let bunnyPosts = [];
    if (process.env.BUNNY_API_KEY && process.env.BUNNY_LIBRARY_ID) {
      try {
        const bunnyRes = await axios.get(
          `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`,
          {
            headers: { AccessKey: process.env.BUNNY_API_KEY },
            params:  { page, itemsPerPage: limit },
            timeout: 5000,
          }
        );
        const cdn      = process.env.BUNNY_CDN_HOSTNAME;
        bunnyPosts     = (bunnyRes.data.items || []).map(v => ({
          _id:          v.guid,
          videoUrl:     `https://${cdn}/${v.guid}/play_720p.mp4`,
          thumbnailUrl: `https://${cdn}/${v.guid}/thumbnail.jpg`,
          title:        v.title || 'Untitled',
          description:  v.description || '',
          source:       'bunny',
          bunnyId:      v.guid,
          createdAt:    v.dateUploaded,
        }));
      } catch (bunnyErr) {
        console.warn('⚠️  Bunny.net fetch failed, using local DB:', bunnyErr.message);
      }
    }

    const dbPosts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total   = await Post.countDocuments();

    const posts   = bunnyPosts.length > 0 ? bunnyPosts : dbPosts;

    res.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// POST /api/posts  (manual seed/create)
exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
