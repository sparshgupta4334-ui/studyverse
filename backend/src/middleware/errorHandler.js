'use strict';

const logger = require('../utils/logger');

/**
 * Global error handler – must be registered last in Express middleware chain.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Default to 500
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  const details = err.details || null;

  // PostgreSQL unique-constraint violation
  if (err.code === '23505') {
    statusCode = 409;
    message = 'A record with the provided data already exists';
  }

  // PostgreSQL foreign-key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors from express-validator
  if (err.name === 'ValidationError') {
    statusCode = 422;
  }

  if (statusCode >= 500) {
    logger.error('Unhandled server error', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * 404 handler – register before errorHandler but after all routes.
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
