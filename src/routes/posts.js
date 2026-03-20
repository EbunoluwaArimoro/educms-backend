const express = require('express');
const { body } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const uploadMiddleware = require('../middleware/upload');

const router = express.Router();

// Validation rules
const postValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').optional().isIn(['draft', 'published', 'archived'])
];

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes (Only Admins, Editors, and Authors can create/edit posts)
router.use(protect);
router.use(authorize('admin', 'editor', 'author'));

router.post('/', uploadMiddleware('featured_image'), validate(postValidation), createPost);
router.put('/:id', validate(postValidation), updatePost);
router.delete('/:id', deletePost);

module.exports = router;