'use strict';

const { Router } = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');

const authRoutes        = require('./auth');
const customerRoutes    = require('./customers');
const transactionRoutes = require('./transactions');
const paymentRoutes     = require('./payments');
const reminderRoutes    = require('./reminders');
const reportRoutes      = require('./reports');
const syncRoutes        = require('./sync');

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Apply the global rate limiter to all API sub-routes
router.use(apiLimiter);

router.use('/auth',         authRoutes);
router.use('/customers',    customerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/payments',     paymentRoutes);
router.use('/reminders',    reminderRoutes);
router.use('/reports',      reportRoutes);
router.use('/sync',         syncRoutes);

module.exports = router;
