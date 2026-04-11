const cron = require('node-cron');
const ReminderModel = require('../models/Reminder');
const { sendReminderSMS } = require('./reminderService');
const logger = require('../utils/logger');

/**
 * Process all pending scheduled reminders
 */
const processPendingReminders = async () => {
  try {
    const pendingReminders = await ReminderModel.getPendingScheduled();
    logger.info(`Processing ${pendingReminders.length} pending reminders`);

    for (const reminder of pendingReminders) {
      try {
        await sendReminderSMS(reminder.customer_phone, reminder.message);
        await ReminderModel.updateStatus(reminder.reminder_id, 'sent', new Date().toISOString());
        logger.info('Reminder sent', { reminderId: reminder.reminder_id });
      } catch (error) {
        await ReminderModel.updateStatus(reminder.reminder_id, 'failed');
        logger.error('Failed to send reminder', { reminderId: reminder.reminder_id, error: error.message });
      }
    }
  } catch (error) {
    logger.error('Error processing reminders', { error: error.message });
  }
};

/**
 * Start background sync job
 */
const startSyncScheduler = () => {
  // Run every 5 minutes to process pending reminders
  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running scheduled reminder processing');
    await processPendingReminders();
  });

  // Daily cleanup at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Running daily cleanup');
    // Could add cleanup tasks here
  });

  logger.info('Sync scheduler started');
};

module.exports = { processPendingReminders, startSyncScheduler };
