'use strict';

const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const paymentService = require('../services/paymentService');
const { withTransaction, query } = require('../config/database');
const { generateReceiptId, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * POST /payments/orders
 * Create a Razorpay order for a given customer debt.
 */
const createOrder = async (req, res, next) => {
  try {
    const { customerId, amount, description } = req.body;

    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const amountPaise = Math.round(parseFloat(amount) * 100);
    if (amountPaise <= 0) {
      return res.status(422).json({ success: false, message: 'Amount must be greater than zero' });
    }

    const receipt = generateReceiptId();
    const rpOrder = await paymentService.createOrder({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: req.user.id,
        customerId,
        customerName: customer.name,
      },
    });

    const payment = await Payment.create({
      userId: req.user.id,
      customerId,
      razorpayOrderId: rpOrder.id,
      amount: amountPaise,
      currency: 'INR',
      receipt,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Payment order created',
      data: {
        payment,
        order: {
          id: rpOrder.id,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          receipt: rpOrder.receipt,
        },
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /payments/verify
 * Verify Razorpay payment signature and record the transaction.
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = paymentService.verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      logger.warn('Invalid Razorpay signature', { orderId: razorpay_order_id });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const existingPayment = await Payment.findByOrderId(razorpay_order_id);
    if (!existingPayment) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (existingPayment.status === 'paid') {
      return res.json({ success: true, message: 'Payment already verified', data: existingPayment });
    }

    // Fetch additional details from Razorpay
    const rpPayment = await paymentService.fetchPayment(razorpay_payment_id);

    const updatedPayment = await withTransaction(async (client) => {
      const p = await Payment.updateStatus(razorpay_order_id, {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        method: rpPayment.method,
        upiTransactionId: rpPayment.acquirer_data?.upi_transaction_id || null,
      });

      // Record a credit transaction for the customer
      const newBalance = await Customer.updateBalance(client, existingPayment.customer_id, p.amount);
      await Transaction.create(client, {
        userId: existingPayment.user_id,
        customerId: existingPayment.customer_id,
        type: 'credit',
        amount: p.amount,
        balanceAfter: newBalance,
        notes: `Payment received via ${rpPayment.method || 'UPI'} – ${razorpay_payment_id}`,
        referenceNo: razorpay_payment_id,
        paymentId: p.payment_id,
      });

      return p;
    });

    logger.info('Payment verified', { paymentId: razorpay_payment_id, orderId: razorpay_order_id });
    res.json({ success: true, message: 'Payment verified successfully', data: updatedPayment });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /payments/webhook
 * Handle Razorpay webhook events.
 * Note: raw body must be preserved (use express.raw() for this route).
 */
const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (signature) {
      const isValid = paymentService.verifyWebhookSignature(req.rawBody || req.body, signature);
      if (!isValid) {
        logger.warn('Invalid webhook signature');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = event?.event;

    logger.info('Razorpay webhook received', { event: eventType });

    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
      const paymentData = event.payload?.payment?.entity;
      if (paymentData?.order_id) {
        const existing = await Payment.findByOrderId(paymentData.order_id);
        if (existing && existing.status !== 'paid') {
          await Payment.updateStatus(paymentData.order_id, {
            status: 'paid',
            razorpayPaymentId: paymentData.id,
            method: paymentData.method,
            webhookEvent: event,
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentData = event.payload?.payment?.entity;
      if (paymentData?.order_id) {
        await Payment.updateStatus(paymentData.order_id, {
          status: 'failed',
          webhookEvent: event,
        });
      }
    } else if (eventType === 'refund.created') {
      const refundData = event.payload?.refund?.entity;
      const paymentId = refundData?.payment_id;
      if (paymentId) {
        const res2 = await query('SELECT * FROM payments WHERE razorpay_payment_id = $1', [paymentId]);
        if (res2.rows[0]) {
          await Payment.updateStatus(res2.rows[0].razorpay_order_id, {
            status: 'refunded',
            webhookEvent: event,
          });
        }
      }
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /customers/:customerId/payments
 */
const listPaymentsByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { limit = 20, cursor } = req.query;

    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { data, hasMore, nextCursor } = await Payment.findByCustomer({
      customerId,
      userId: req.user.id,
      limit,
      cursor,
    });

    res.json({
      success: true,
      ...paginate({ data, total: data.length, limit: parseInt(limit, 10), offset: 0, nextCursor }),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /payments/:id
 */
const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id, req.user.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, verifyPayment, handleWebhook, listPaymentsByCustomer, getPayment };
