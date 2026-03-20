const express = require('express');
const { body } = require('express-validator');
const { getPostComments, createComment, updateCommentStatus, deleteComment } = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

// Merge params allows us to access the postId from the parent router (posts.js)
const router = express.Router({ mergeParams: true });

// Publicly viewable
router.get('/post/:postId', getPostComments);

// Require login to comment
router.use(protect);
router.post('/post/:postId', validate([body('content').notEmpty()]), createComment);

// Admin/Editor only
router.put('/:id/status', authorize('admin', 'editor'), updateCommentStatus);
router.delete('/:id', authorize('admin', 'editor'), deleteComment);

module.exports = router;