const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const authValidators = {
  verifyOtp: [
    body('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Invalid phone number'),
    body('firebaseToken').notEmpty().withMessage('Firebase token is required'),
    handleValidationErrors,
  ],
  refreshToken: [body('refreshToken').notEmpty().withMessage('Refresh token is required'), handleValidationErrors],
};

const customerValidators = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('Customer name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2-100 characters'),
    body('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Invalid Indian mobile number'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    handleValidationErrors,
  ],
  update: [
    param('id').isUUID().withMessage('Invalid customer ID'),
    body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian mobile number'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    handleValidationErrors,
  ],
  getById: [param('id').isUUID().withMessage('Invalid customer ID'), handleValidationErrors],
  search: [
    query('q').optional().isString().isLength({ max: 100 }),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),
    handleValidationErrors,
  ],
};

const transactionValidators = {
  create: [
    body('customerId').notEmpty().withMessage('Customer ID is required').isUUID().withMessage('Invalid customer ID'),
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
    body('type')
      .notEmpty()
      .withMessage('Transaction type is required')
      .isIn(['credit', 'debit'])
      .withMessage('Type must be credit or debit'),
    body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
    handleValidationErrors,
  ],
  getByCustomer: [
    param('customerId').isUUID().withMessage('Invalid customer ID'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
    handleValidationErrors,
  ],
};

const paymentValidators = {
  initiate: [
    body('customerId').notEmpty().isUUID().withMessage('Invalid customer ID'),
    body('amount').notEmpty().isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('upiId').optional().isString().withMessage('Invalid UPI ID'),
    handleValidationErrors,
  ],
  verify: [
    body('razorpayPaymentId').notEmpty().withMessage('Payment ID is required'),
    body('razorpayOrderId').notEmpty().withMessage('Order ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Signature is required'),
    handleValidationErrors,
  ],
};

const reminderValidators = {
  send: [
    body('customerId').notEmpty().isUUID().withMessage('Invalid customer ID'),
    body('message').notEmpty().isLength({ min: 10, max: 500 }).withMessage('Message must be 10-500 characters'),
    handleValidationErrors,
  ],
  schedule: [
    body('customerId').notEmpty().isUUID().withMessage('Invalid customer ID'),
    body('message').notEmpty().isLength({ min: 10, max: 500 }),
    body('scheduledAt').notEmpty().isISO8601().withMessage('Invalid scheduled date'),
    handleValidationErrors,
  ],
};

module.exports = {
  authValidators,
  customerValidators,
  transactionValidators,
  paymentValidators,
  reminderValidators,
  handleValidationErrors,
};
