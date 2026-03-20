const Media = require('../models/Media');
const { successResponse, errorResponse } = require('../utils/helpers');
const fs = require('fs');
const path = require('path');

exports.getMedia = async (req, res, next) => {
  try {
    const media = await Media.findAll();
    res.status(200).json(successResponse(media, 'Media retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('Please upload a file'));
    }

    const mediaData = {
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`,
      file_type: req.file.mimetype.split('/')[0], // e.g., 'image'
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      uploaded_by: req.user.id
    };

    const media = await Media.create(mediaData);
    res.status(201).json(successResponse(media, 'File uploaded successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json(errorResponse('Media not found'));

    // Delete physical file
    const filePath = path.join(process.cwd(), media.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await Media.delete(req.params.id);
    res.status(200).json(successResponse(null, 'Media deleted successfully'));
  } catch (error) {
    next(error);
  }
};