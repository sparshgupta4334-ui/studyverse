const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const { paymentValidators } = require('../utils/validators');

router.use(authMiddleware);

/**
 * @route  POST /api/payments/initiate
 * @desc   Create a Razorpay order
 * @access Private
 */
router.post('/initiate', paymentValidators.initiate, paymentController.initiatePayment);

/**
 * @route  POST /api/payments/verify
 * @desc   Verify Razorpay payment signature and update ledger
 * @access Private
 */
router.post('/verify', paymentValidators.verify, paymentController.verifyPayment);

/**
 * @route  GET /api/payments/customer/:customerId
 * @desc   Get payment history for a customer
 * @access Private
 */
router.get('/customer/:customerId', paymentController.getPaymentHistory);

module.exports = router;
