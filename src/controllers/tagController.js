const Tag = require('../models/Tag');
const { successResponse, errorResponse, generateSlug } = require('../utils/helpers');

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(successResponse(tags, 'Tags retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = generateSlug(name);
    
    const tag = await Tag.create({ name, slug, description });
    res.status(201).json(successResponse(tag, 'Tag created successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const deleted = await Tag.delete(req.params.id);
    if (!deleted) return res.status(404).json(errorResponse('Tag not found'));
    res.status(200).json(successResponse(null, 'Tag deleted successfully'));
  } catch (error) {
    next(error);
  }
};