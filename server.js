require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

// 1. Local Development Setup
// If we are NOT in production (Vercel), start the server normally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  const startServer = async () => {
    const isDbConnected = await testConnection();
    if (isDbConnected) {
      app.listen(PORT, () => {
        logger.info(`Server running in development mode on port ${PORT}`);
      });
    } else {
      logger.error('Failed to connect to database.');
    }
  };

  startServer();
}

// 2. Vercel Serverless Setup
// Vercel requires us to export the Express app directly rather than starting it
module.exports = app;