'use strict';

const Reminder = require('../models/Reminder');
const Customer = require('../models/Customer');
const User = require('../models/User');
const smsService = require('../services/smsService');
const { paginate, sanitizePhone } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * POST /customers/:customerId/reminders
 * Send an immediate SMS reminder or schedule one.
 */
const createReminder = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { message, phone, scheduledAt } = req.body;

    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const targetPhone = sanitizePhone(phone || customer.phone || '');
    if (!targetPhone || targetPhone.length < 10) {
      return res.status(422).json({ success: false, message: 'Valid phone number is required' });
    }

    const user = await User.findById(req.user.id);

    // Build message text if not provided
    const smsBody =
      message ||
      smsService.buildReminderMessage({
        customerName: customer.name,
        balance: customer.balance,
        businessName: user?.business_name,
      });

    const reminder = await Reminder.create({
      userId: req.user.id,
      customerId,
      phone: targetPhone,
      message: smsBody,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
    });

    // Send immediately if not scheduled in the future
    const isImmediate = !scheduledAt || new Date(scheduledAt) <= new Date();
    if (isImmediate) {
      try {
        const result = await smsService.sendSMS(targetPhone, smsBody);
        await Reminder.updateStatus(reminder.id, {
          status: 'sent',
          providerSid: result.sid,
          sentAt: new Date(),
          provider: result.provider,
        });
        logger.info('Reminder sent immediately', { reminderId: reminder.id });
        return res.status(201).json({
          success: true,
          message: 'Reminder sent',
          data: { ...reminder, status: 'sent' },
        });
      } catch (smsErr) {
        await Reminder.updateStatus(reminder.id, {
          status: 'failed',
          errorMessage: smsErr.message,
        });
        logger.error('Immediate reminder failed', { reminderId: reminder.id, error: smsErr.message });
        return res.status(502).json({
          success: false,
          message: 'Reminder created but SMS delivery failed',
          data: reminder,
        });
      }
    }

    res.status(201).json({ success: true, message: 'Reminder scheduled', data: reminder });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /customers/:customerId/reminders
 */
const listReminders = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { limit = 20, cursor } = req.query;

    const customer = await Customer.findById(customerId, req.user.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const { data, hasMore, nextCursor } = await Reminder.findByCustomer({
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
 * GET /reminders/:id
 */
const getReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id, req.user.id);
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
    res.json({ success: true, data: reminder });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /reminders/:id  (cancel a pending reminder)
 */
const cancelReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findById(id, req.user.id);
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });

    if (reminder.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a reminder with status "${reminder.status}"`,
      });
    }

    const updated = await Reminder.updateStatus(id, { status: 'cancelled' });
    res.json({ success: true, message: 'Reminder cancelled', data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /reminders/process-due  (internal / cron endpoint)
 * Process all pending reminders that are due.
 */
const processDueReminders = async (req, res, next) => {
  try {
    const due = await Reminder.findPendingDue();
    const results = await Promise.allSettled(
      due.map(async (reminder) => {
        try {
          const result = await smsService.sendSMS(reminder.phone, reminder.message);
          await Reminder.updateStatus(reminder.id, {
            status: 'sent',
            providerSid: result.sid,
            sentAt: new Date(),
            provider: result.provider,
          });
          return { id: reminder.id, status: 'sent' };
        } catch (err) {
          await Reminder.updateStatus(reminder.id, {
            status: 'failed',
            errorMessage: err.message,
          });
          return { id: reminder.id, status: 'failed', error: err.message };
        }
      }),
    );

    const processed = results.map((r) => r.value || r.reason);
    res.json({ success: true, message: `Processed ${due.length} reminders`, data: processed });
  } catch (err) {
    next(err);
  }
};

module.exports = { createReminder, listReminders, getReminder, cancelReminder, processDueReminders };
