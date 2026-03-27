const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/likesController');

router.post('/',         controller.toggleLike);
router.get('/:postId',   controller.getLikes);

module.exports = router;
