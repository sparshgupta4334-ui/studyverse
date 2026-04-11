'use strict';

const { Router } = require('express');
const { param } = require('express-validator');
const reminderController = require('../controllers/reminderController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get('/:id', [param('id').isUUID()], validate, reminderController.getReminder);

router.delete('/:id', [param('id').isUUID()], validate, reminderController.cancelReminder);

// Internal / cron endpoint to dispatch all due reminders
router.post('/process-due', reminderController.processDueReminders);

module.exports = router;
