const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.findByPost(req.params.postId);
    res.status(200).json(successResponse(comments, 'Comments retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { content, parent_id } = req.body;
    const comment = await Comment.create({
      post_id: req.params.postId,
      user_id: req.user.id,
      parent_id: parent_id || null,
      content
    });
    res.status(201).json(successResponse(comment, 'Comment submitted and is pending approval'));
  } catch (error) {
    next(error);
  }
};

exports.updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'spam', 'trash'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status'));
    }
    const comment = await Comment.updateStatus(req.params.id, status);
    if (!comment) return res.status(404).json(errorResponse('Comment not found'));
    res.status(200).json(successResponse(comment, 'Comment status updated'));
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const deleted = await Comment.delete(req.params.id);
    if (!deleted) return res.status(404).json(errorResponse('Comment not found'));
    res.status(200).json(successResponse(null, 'Comment deleted successfully'));
  } catch (error) {
    next(error);
  }
};