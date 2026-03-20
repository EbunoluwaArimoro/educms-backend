const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const errorHandler = require('./middleware/errorHandler');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const mediaRoutes = require('./routes/media');

// Route imports
const authRoutes = require('./routes/auth');

const app = express();

// Global Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Request logging

// API Routes
const apiRouter = express.Router();
app.use(`/api/${process.env.API_VERSION || 'v1'}`, apiRouter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/posts', postRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/tags', tagRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/comments', commentRoutes);
apiRouter.use('/media', mediaRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;