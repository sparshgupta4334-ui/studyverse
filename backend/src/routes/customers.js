'use strict';

const { Router } = require('express');
const { body, query, param } = require('express-validator');
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionController');
const reminderController = require('../controllers/reminderController');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── Customer CRUD ─────────────────────────────────────────────────────────────

router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('cursor').optional().isUUID(),
    query('search').optional().isLength({ max: 100 }).trim(),
    query('active').optional().isIn(['true', 'false']),
  ],
  validate,
  customerController.listCustomers,
);

router.post(
  '/',
  [
    body('name').notEmpty().isLength({ max: 150 }).trim().escape(),
    body('phone').optional().isMobilePhone().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('address').optional().isLength({ max: 500 }).trim(),
    body('notes').optional().isLength({ max: 1000 }).trim(),
  ],
  validate,
  customerController.createCustomer,
);

router.get(
  '/:id',
  [param('id').isUUID()],
  validate,
  customerController.getCustomer,
);

router.patch(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().isLength({ max: 150 }).trim().escape(),
    body('phone').optional().isMobilePhone().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('address').optional().isLength({ max: 500 }).trim(),
    body('notes').optional().isLength({ max: 1000 }).trim(),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  customerController.updateCustomer,
);

router.delete(
  '/:id',
  [param('id').isUUID()],
  validate,
  customerController.deleteCustomer,
);

// ── Customer Transactions ─────────────────────────────────────────────────────

router.get(
  '/:customerId/transactions',
  [
    param('customerId').isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('cursor').optional().isString(),
    query('type').optional().isIn(['credit', 'debit']),
  ],
  validate,
  transactionController.listByCustomer,
);

router.post(
  '/:customerId/transactions',
  [
    param('customerId').isUUID(),
    body('type').isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description').optional().isLength({ max: 500 }).trim(),
    body('referenceNo').optional().isLength({ max: 100 }).trim(),
  ],
  validate,
  transactionController.createTransaction,
);

router.get(
  '/:customerId/transactions/:id',
  [param('customerId').isUUID(), param('id').isUUID()],
  validate,
  transactionController.getTransaction,
);

// ── Customer Reminders ────────────────────────────────────────────────────────

router.get(
  '/:customerId/reminders',
  [param('customerId').isUUID(), query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  reminderController.listReminders,
);

router.post(
  '/:customerId/reminders',
  [
    param('customerId').isUUID(),
    body('phone').optional().isMobilePhone(),
    body('message').optional().isLength({ max: 500 }).trim(),
    body('scheduledAt').optional().isISO8601(),
  ],
  validate,
  reminderController.createReminder,
);

// ── Customer Payments ─────────────────────────────────────────────────────────

router.get(
  '/:customerId/payments',
  [param('customerId').isUUID(), query('limit').optional().isInt({ min: 1, max: 100 })],
  validate,
  paymentController.listPaymentsByCustomer,
);

module.exports = router;
