const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(successResponse(users, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(errorResponse('User not found'));
    res.status(200).json(successResponse(user));
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) return res.status(404).json(errorResponse('User not found'));
    res.status(200).json(successResponse(user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent users from deleting themselves
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json(errorResponse('You cannot delete your own account'));
    }
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json(errorResponse('User not found'));
    res.status(200).json(successResponse(null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};