'use strict';

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Verify the Bearer JWT on every protected route.
 * Attaches the decoded payload to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid authentication token';
      return res.status(401).json({ success: false, message });
    }

    // Verify the user still exists and is active
    const result = await query(
      'SELECT user_id, phone, name, is_active FROM users WHERE user_id = $1',
      [decoded.sub],
    );

    if (!result.rows.length || !result.rows[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or deactivated',
      });
    }

    req.user = {
      id: result.rows[0].user_id,
      phone: result.rows[0].phone,
      name: result.rows[0].name,
    };

    next();
  } catch (err) {
    logger.error('Authentication middleware error', { error: err.message });
    next(err);
  }
};

/**
 * Optional auth – attaches req.user if a valid token is present but does NOT
 * reject requests without one.
 */
const optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const result = await query(
      'SELECT user_id, phone, name FROM users WHERE user_id = $1 AND is_active = TRUE',
      [decoded.sub],
    );
    if (result.rows.length) req.user = { ...result.rows[0], id: result.rows[0].user_id };
  } catch {
    // Ignore errors – treat as unauthenticated
  }
  next();
};

module.exports = { authenticate, optionalAuthenticate };
