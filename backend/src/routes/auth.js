const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { authValidators } = require('../utils/validators');

/**
 * @route  POST /api/auth/login
 * @desc   Login/register with Firebase OTP token
 * @access Public
 */
router.post('/login', authValidators.verifyOtp, authController.login);

/**
 * @route  POST /api/auth/refresh
 * @desc   Refresh access token
 * @access Public
 */
router.post('/refresh', authValidators.refreshToken, authController.refresh);

/**
 * @route  GET /api/auth/profile
 * @desc   Get current user profile
 * @access Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route  PUT /api/auth/profile
 * @desc   Update user profile
 * @access Private
 */
router.put('/profile', authMiddleware, authController.updateProfile);

/**
 * @route  POST /api/auth/logout
 * @desc   Logout user
 * @access Private
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
