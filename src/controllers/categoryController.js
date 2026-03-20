const Category = require('../models/Category');
const { successResponse, errorResponse, generateSlug } = require('../utils/helpers');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(successResponse(categories, 'Categories retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json(errorResponse('Category not found'));
    res.status(200).json(successResponse(category));
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent_id, display_order } = req.body;
    const slug = generateSlug(name);
    
    const category = await Category.create({ name, slug, description, parent_id, display_order });
    res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.update(req.params.id, req.body);
    if (!category) return res.status(404).json(errorResponse('Category not found'));
    res.status(200).json(successResponse(category, 'Category updated successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.delete(req.params.id);
    if (!deleted) return res.status(404).json(errorResponse('Category not found'));
    res.status(200).json(successResponse(null, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};