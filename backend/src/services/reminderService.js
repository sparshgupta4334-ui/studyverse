const twilio = require('twilio');
const https = require('https');
const logger = require('../utils/logger');

let twilioClient = null;

const getTwilioClient = () => {
  if (!twilioClient) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

/**
 * Send SMS via Twilio
 */
const sendSMSViaTwilio = async (to, message) => {
  const client = getTwilioClient();
  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to.startsWith('+') ? to : `+91${to}`,
  });
  logger.info('SMS sent via Twilio', { to, messageSid: result.sid });
  return { sid: result.sid, status: result.status };
};

/**
 * Send SMS via Fast2SMS (Indian SMS provider)
 */
const sendSMSViaFast2SMS = async (phone, message) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'www.fast2sms.com',
      path: '/dev/bulkV2',
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
    };

    const data = JSON.stringify({
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: phone.replace(/^\+91/, ''),
    });

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.return) {
            logger.info('SMS sent via Fast2SMS', { phone });
            resolve(parsed);
          } else {
            reject(new Error(`Fast2SMS error: ${body}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

/**
 * Send reminder SMS - tries Twilio first, falls back to Fast2SMS
 */
const sendReminderSMS = async (phone, message) => {
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      return await sendSMSViaTwilio(phone, message);
    } else if (process.env.FAST2SMS_API_KEY) {
      return await sendSMSViaFast2SMS(phone, message);
    } else {
      logger.warn('No SMS provider configured. Message not sent.', { phone });
      return { status: 'skipped', reason: 'no_provider' };
    }
  } catch (error) {
    logger.error('Failed to send SMS', { phone, error: error.message });
    throw error;
  }
};

/**
 * Generate reminder message from template
 */
const generateReminderMessage = (customerName, balance, businessName = 'your business') => {
  if (balance > 0) {
    return `Hi ${customerName}, you have an outstanding balance of ₹${balance.toFixed(2)} at ${businessName}. Please clear your dues. Thank you!`;
  } else {
    return `Hi ${customerName}, this is a reminder regarding your account at ${businessName}. Please contact us. Thank you!`;
  }
};

module.exports = { sendReminderSMS, generateReminderMessage, sendSMSViaTwilio, sendSMSViaFast2SMS };
