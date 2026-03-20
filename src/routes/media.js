const express = require('express');
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'editor', 'author'));

router.get('/', getMedia);
router.post('/upload', uploadMiddleware('file'), uploadMedia);
router.delete('/:id', deleteMedia);

module.exports = router;