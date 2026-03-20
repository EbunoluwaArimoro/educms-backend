const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Base transport: Always log to the console
const transports = [
  new winston.transports.Console({
    format: consoleFormat
  })
];

// BULLETPROOF CHECK: Try to create logs, but fail silently if Vercel blocks it
try {
  // Vercel automatically sets a 'VERCEL' environment variable we can check
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const fs = require('fs');
    const logsDir = path.join(process.cwd(), 'logs');
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir); // This is what Vercel was rejecting
    }

    transports.push(
      new winston.transports.File({
        filename: path.join('logs', 'error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join('logs', 'combined.log')
      })
    );
  }
} catch (error) {
  // If Vercel throws the EROFS error, we catch it here and ignore it.
  // The app will survive and continue running using only the Console logger.
  console.warn('Read-only file system detected. File logging disabled.');
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'educms-api' },
  transports: transports
});

module.exports = logger;