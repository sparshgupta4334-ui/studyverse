'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.post(
  '/verify-otp',
  authLimiter,
  [
    body('idToken').notEmpty().withMessage('Firebase ID token is required'),
    body('name').optional().isLength({ max: 100 }).trim().escape(),
    body('businessName').optional().isLength({ max: 150 }).trim().escape(),
  ],
  validate,
  authController.verifyOTP,
);

router.post(
  '/refresh',
  authLimiter,
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validate,
  authController.refreshToken,
);

router.post('/logout', authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.get('/me', authenticate, authController.getMe);

router.patch(
  '/me',
  authenticate,
  [
    body('name').optional().isLength({ max: 100 }).trim().escape(),
    body('email').optional().isEmail().normalizeEmail(),
    body('business_name').optional().isLength({ max: 150 }).trim().escape(),
    body('avatar_url').optional().isURL(),
  ],
  validate,
  authController.updateMe,
);

module.exports = router;
