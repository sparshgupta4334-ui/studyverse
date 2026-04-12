import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  logout,
  getMe,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';

const router = Router();

router.post(
  '/register',
  [
    body('phone').notEmpty().trim().withMessage('Phone is required'),
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('phone').notEmpty().trim().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/send-otp',
  [body('phone').notEmpty().trim().withMessage('Phone is required')],
  validate,
  sendOTP
);

router.post(
  '/verify-otp',
  [
    body('phone').notEmpty().trim().withMessage('Phone is required'),
    body('otp').notEmpty().withMessage('OTP is required'),
  ],
  validate,
  verifyOTP
);

router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
