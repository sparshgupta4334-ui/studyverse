'use strict';

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { webhookLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Webhook – no JWT auth; raw body preserved by app.js
router.post(
  '/webhook',
  webhookLimiter,
  paymentController.handleWebhook,
);

// All other payment routes require auth
router.use(authenticate);

router.post(
  '/orders',
  [
    body('customerId').isUUID(),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
    body('description').optional().isLength({ max: 500 }).trim(),
  ],
  validate,
  paymentController.createOrder,
);

router.post(
  '/verify',
  [
    body('razorpay_order_id').notEmpty(),
    body('razorpay_payment_id').notEmpty(),
    body('razorpay_signature').notEmpty(),
  ],
  validate,
  paymentController.verifyPayment,
);

router.get(
  '/:id',
  [param('id').isUUID()],
  validate,
  paymentController.getPayment,
);

module.exports = router;
