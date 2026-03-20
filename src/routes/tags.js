const express = require('express');
const { body } = require('express-validator');
const { getTags, createTag, deleteTag } = require('../controllers/tagController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.get('/', getTags);

router.use(protect);
router.use(authorize('admin', 'editor', 'author')); 

router.post('/', validate([body('name').notEmpty()]), createTag);
router.delete('/:id', authorize('admin', 'editor'), deleteTag); // Only admins/editors delete tags

module.exports = router;