'use strict';

const twilio = require('twilio');
const axios = require('axios');
const logger = require('../utils/logger');

const PROVIDER = process.env.SMS_PROVIDER || 'twilio';

// ─── Twilio ──────────────────────────────────────────────────────────────────

let twilioClient;
const getTwilioClient = () => {
  if (!twilioClient) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw Object.assign(new Error('Twilio credentials not configured'), { statusCode: 503 });
    }
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

const sendViaTwilio = async (to, body) => {
  const client = getTwilioClient();
  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body,
  });
  logger.info('SMS sent via Twilio', { sid: message.sid, to });
  return { provider: 'twilio', sid: message.sid, status: message.status };
};

// ─── Fast2SMS ────────────────────────────────────────────────────────────────

const sendViaFast2SMS = async (to, message) => {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('Fast2SMS API key not configured'), { statusCode: 503 });
  }

  // Strip leading +91 / 91 for Fast2SMS (expects 10-digit numbers)
  const number = to.replace(/^\+?91/, '');

  const response = await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: number,
    },
    {
      headers: { authorization: apiKey },
      timeout: 10000,
    },
  );

  if (!response.data.return) {
    throw new Error(`Fast2SMS error: ${JSON.stringify(response.data)}`);
  }

  logger.info('SMS sent via Fast2SMS', { to: number, requestId: response.data.request_id });
  return { provider: 'fast2sms', sid: response.data.request_id, status: 'queued' };
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Send an SMS using the configured provider.
 * @param {string} to   - E.164 phone number
 * @param {string} body - Message text
 */
const sendSMS = async (to, body) => {
  try {
    if (PROVIDER === 'fast2sms') {
      return await sendViaFast2SMS(to, body);
    }
    return await sendViaTwilio(to, body);
  } catch (err) {
    logger.error('SMS send failed', { to, provider: PROVIDER, error: err.message });
    throw err;
  }
};

/**
 * Build a payment-reminder message.
 */
const buildReminderMessage = ({ customerName, balance, businessName }) => {
  const absBalance = Math.abs(balance);
  const rupees = (absBalance / 100).toFixed(2);
  const biz = businessName ? ` from ${businessName}` : '';
  return `Dear ${customerName}, you have an outstanding balance of ₹${rupees}${biz}. Please clear your dues at your earliest convenience. Thank you!`;
};

module.exports = { sendSMS, buildReminderMessage };
