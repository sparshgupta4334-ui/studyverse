const { createOrder, verifyPaymentSignature, fetchPaymentDetails } = require('../services/paymentService');
const PaymentModel = require('../models/Payment');
const TransactionModel = require('../models/Transaction');
const CustomerModel = require('../models/Customer');
const { getClient } = require('../config/database');
const { formatAmount, generateRefId } = require('../utils/helpers');
const logger = require('../utils/logger');

const initiatePayment = async (req, res) => {
  const { customerId, amount, upiId } = req.body;
  const formattedAmount = formatAmount(amount);

  // Verify customer
  const customer = await CustomerModel.findById(customerId, req.user.userId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const receipt = generateRefId('RCP');

  const order = await createOrder({
    amount: formattedAmount,
    receipt,
    notes: {
      customerId,
      userId: req.user.userId,
      customerName: customer.name,
      customerPhone: customer.phone,
    },
  });

  // Record pending payment
  const payment = await PaymentModel.create({
    customerId,
    userId: req.user.userId,
    amount: formattedAmount,
    upiId: upiId || null,
    orderId: order.id,
    status: 'pending',
    gatewayResponse: order,
  });

  logger.info('Payment initiated', { paymentId: payment.payment_id, orderId: order.id });

  res.status(201).json({
    success: true,
    message: 'Payment order created',
    data: {
      paymentId: payment.payment_id,
      orderId: order.id,
      amount: formattedAmount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      customerName: customer.name,
      customerPhone: customer.phone,
    },
  });
};

const verifyPayment = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  // Verify signature
  const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    logger.warn('Invalid payment signature', { orderId: razorpayOrderId, paymentId: razorpayPaymentId });
    return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
  }

  // Find payment record
  const payment = await PaymentModel.findByOrderId(razorpayOrderId);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment record not found' });
  }

  if (payment.status === 'completed') {
    return res.status(200).json({ success: true, message: 'Payment already processed', data: payment });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Fetch payment details from Razorpay
    const paymentDetails = await fetchPaymentDetails(razorpayPaymentId);

    // Update payment status
    const updatedPayment = await PaymentModel.updateStatus(payment.payment_id, 'completed', paymentDetails);

    // Create transaction for the payment (credit)
    const txn = await TransactionModel.create({
      customerId: payment.customer_id,
      amount: parseFloat(payment.amount),
      type: 'credit',
      notes: `Payment via UPI - ${razorpayPaymentId}`,
      referenceId: razorpayPaymentId,
      createdBy: payment.user_id,
    }, client);

    // Update payment with transaction ID
    await client.query(
      'UPDATE payments SET transaction_id = $1 WHERE payment_id = $2',
      [txn.transaction_id, payment.payment_id]
    );

    // Update customer balance
    await CustomerModel.updateBalance(payment.customer_id, parseFloat(payment.amount), client);

    await client.query('COMMIT');

    logger.info('Payment verified and processed', { paymentId: payment.payment_id, transactionId: txn.transaction_id });

    res.status(200).json({
      success: true,
      message: 'Payment verified and recorded successfully',
      data: {
        paymentId: updatedPayment.payment_id,
        transactionId: txn.transaction_id,
        amount: parseFloat(payment.amount),
        status: 'completed',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getPaymentHistory = async (req, res) => {
  const { customerId } = req.params;

  const customer = await CustomerModel.findById(customerId, req.user.userId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const payments = await PaymentModel.findByCustomer(customerId, req.user.userId);

  res.status(200).json({
    success: true,
    data: payments,
  });
};

module.exports = { initiatePayment, verifyPayment, getPaymentHistory };
