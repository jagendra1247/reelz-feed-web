const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/postsController');

router.get('/',    controller.getPosts);
router.get('/:id', controller.getPost);
router.post('/',   controller.createPost);

module.exports = router;
