import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  verifyPayment,
  getPayments,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

router.get('/', getPayments);

router.post(
  '/create-order',
  [
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer (paise)'),
    body('customer_id').notEmpty().isUUID().withMessage('Valid customer_id required'),
  ],
  validate,
  createOrder
);

router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty().withMessage('razorpay_order_id required'),
    body('razorpay_payment_id').notEmpty().withMessage('razorpay_payment_id required'),
    body('razorpay_signature').notEmpty().withMessage('razorpay_signature required'),
  ],
  validate,
  verifyPayment
);

export default router;
