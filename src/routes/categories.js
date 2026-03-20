const express = require('express');
const { body } = require('express-validator');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required').isLength({ max: 100 })
];

router.get('/', getCategories);
router.get('/:id', getCategory);

router.use(protect);
router.use(authorize('admin', 'editor')); // Only admins and editors manage categories

router.post('/', validate(categoryValidation), createCategory);
router.put('/:id', validate(categoryValidation), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;