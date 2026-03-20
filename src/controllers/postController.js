const Post = require('../models/Post');
const { successResponse, errorResponse, generateSlug, paginate, getPaginationMeta } = require('../utils/helpers');

exports.getPosts = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const { posts, total } = await Post.findAll({ limit, offset });
    
    const meta = getPaginationMeta(total, page, limit);
    res.status(200).json(successResponse({ posts, meta }, 'Posts retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json(errorResponse('Post not found'));
    
    res.status(200).json(successResponse(post));
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category_id, status } = req.body;
    let featured_image = null;

    if (req.file) {
      featured_image = `/uploads/${req.file.filename}`;
    }

    const slug = generateSlug(title);
    
    const post = await Post.create({
      title, slug, content, excerpt, 
      author_id: req.user.id, 
      category_id, status, featured_image
    });

    res.status(201).json(successResponse(post, 'Post created successfully'));
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.update(req.params.id, req.body);
    if (!post) return res.status(404).json(errorResponse('Post not found'));
    
    res.status(200).json(successResponse(post, 'Post updated successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.delete(req.params.id);
    if (!deleted) return res.status(404).json(errorResponse('Post not found'));
    
    res.status(200).json(successResponse(null, 'Post deleted successfully'));
  } catch (error) {
    next(error);
  }
};