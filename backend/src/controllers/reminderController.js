const ReminderModel = require('../models/Reminder');
const CustomerModel = require('../models/Customer');
const { sendReminderSMS, generateReminderMessage } = require('../services/reminderService');
const logger = require('../utils/logger');

const sendReminder = async (req, res) => {
  const { customerId, message } = req.body;

  const customer = await CustomerModel.findById(customerId, req.user.userId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const finalMessage = message || generateReminderMessage(customer.name, parseFloat(customer.balance));

  // Save reminder record
  const reminder = await ReminderModel.create({
    customerId,
    userId: req.user.userId,
    message: finalMessage,
    status: 'pending',
  });

  // Send SMS
  try {
    await sendReminderSMS(customer.phone, finalMessage);
    await ReminderModel.updateStatus(reminder.reminder_id, 'sent', new Date().toISOString());
    logger.info('Reminder sent', { reminderId: reminder.reminder_id, customerId });

    res.status(200).json({
      success: true,
      message: 'Reminder sent successfully',
      data: { reminderId: reminder.reminder_id, status: 'sent' },
    });
  } catch (error) {
    await ReminderModel.updateStatus(reminder.reminder_id, 'failed');
    logger.error('Failed to send reminder', { reminderId: reminder.reminder_id, error: error.message });

    res.status(500).json({
      success: false,
      message: 'Failed to send reminder. It has been saved for retry.',
      data: { reminderId: reminder.reminder_id, status: 'failed' },
    });
  }
};

const scheduleReminder = async (req, res) => {
  const { customerId, message, scheduledAt } = req.body;

  const customer = await CustomerModel.findById(customerId, req.user.userId);
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    return res.status(400).json({ success: false, message: 'Scheduled time must be in the future' });
  }

  const reminder = await ReminderModel.create({
    customerId,
    userId: req.user.userId,
    message: message || generateReminderMessage(customer.name, parseFloat(customer.balance)),
    scheduledAt: scheduledDate.toISOString(),
    status: 'pending',
  });

  logger.info('Reminder scheduled', { reminderId: reminder.reminder_id, scheduledAt });

  res.status(201).json({
    success: true,
    message: 'Reminder scheduled successfully',
    data: reminder,
  });
};

const getAll = async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await ReminderModel.findAll(req.user.userId, { page, limit, status });

  res.status(200).json({
    success: true,
    data: result.reminders,
    pagination: result.pagination,
  });
};

const getById = async (req, res) => {
  const reminder = await ReminderModel.findById(req.params.id, req.user.userId);

  if (!reminder) {
    return res.status(404).json({ success: false, message: 'Reminder not found' });
  }

  res.status(200).json({ success: true, data: reminder });
};

module.exports = { sendReminder, scheduleReminder, getAll, getById };
