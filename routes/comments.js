const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/commentsController');

router.post('/',          controller.addComment);
router.get('/:postId',    controller.getComments);

module.exports = router;
