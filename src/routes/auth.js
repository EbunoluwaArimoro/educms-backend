const express = require('express');
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example of a protected route using the middleware
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, data: { userId: req.user.id, role: req.user.role } });
});

module.exports = router;