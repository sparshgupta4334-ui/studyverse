'use strict';

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 min
const max = parseInt(process.env.RATE_LIMIT_MAX || '1000', 10);

/**
 * Standard rate limiter applied to all API routes.
 */
const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, url: req.originalUrl });
    res.status(429).json({
      success: false,
      message: 'Too many requests – please try again later',
      retryAfter: Math.ceil(windowMs / 1000),
    });
  },
});

/**
 * Stricter limiter for authentication endpoints (prevent brute-force / OTP abuse).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { ip: req.ip });
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts – please wait 15 minutes',
    });
  },
});

/**
 * Webhook endpoints get their own limiter – no IP restriction needed but
 * we cap at 500 to avoid replay floods.
 */
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, webhookLimiter };
