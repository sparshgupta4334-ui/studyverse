'use strict';

const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger');

let razorpayInstance;

const getRazorpay = () => {
  if (!razorpayInstance) {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw Object.assign(new Error('Razorpay credentials not configured'), { statusCode: 503 });
    }
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay order.
 * @param {number} amount   - Amount in paise
 * @param {string} receipt  - Unique receipt ID
 * @param {object} notes    - Key-value metadata
 */
const createOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const rp = getRazorpay();
  try {
    const order = await rp.orders.create({ amount, currency, receipt, notes });
    logger.info('Razorpay order created', { orderId: order.id, amount });
    return order;
  } catch (err) {
    logger.error('Razorpay order creation failed', { error: err.message });
    throw Object.assign(new Error('Failed to create payment order'), { statusCode: 502 });
  }
};

/**
 * Verify the payment signature returned by Razorpay checkout.
 */
const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
};

/**
 * Verify a webhook signature from Razorpay.
 */
const verifyWebhookSignature = (rawBody, receivedSignature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true; // skip if not configured
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSignature));
};

/**
 * Fetch a payment by ID from Razorpay API.
 */
const fetchPayment = async (paymentId) => {
  const rp = getRazorpay();
  try {
    return await rp.payments.fetch(paymentId);
  } catch (err) {
    logger.error('Razorpay payment fetch failed', { paymentId, error: err.message });
    throw Object.assign(new Error('Failed to fetch payment details'), { statusCode: 502 });
  }
};

module.exports = { createOrder, verifyPaymentSignature, verifyWebhookSignature, fetchPayment };
