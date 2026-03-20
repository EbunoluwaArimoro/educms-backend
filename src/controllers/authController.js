const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/helpers');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(errorResponse('Email already in use'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username, email, password_hash, first_name, last_name, role: 'subscriber'
    });

    const token = generateToken(user.user_id, user.role);

    res.status(201).json(successResponse({ user, token }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(errorResponse('Please provide email and password'));
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    await User.updateLastLogin(user.user_id);
    const token = generateToken(user.user_id, user.role);

    // Remove password from response
    delete user.password_hash;

    res.status(200).json(successResponse({ user, token }, 'Logged in successfully'));
  } catch (error) {
    next(error);
  }
};