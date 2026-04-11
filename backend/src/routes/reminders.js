const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middleware/auth');
const { reminderValidators } = require('../utils/validators');

router.use(authMiddleware);

/**
 * @route  GET /api/reminders
 * @desc   Get all reminders for the user
 * @access Private
 */
router.get('/', reminderController.getAll);

/**
 * @route  POST /api/reminders/send
 * @desc   Send an immediate SMS reminder
 * @access Private
 */
router.post('/send', reminderValidators.send, reminderController.sendReminder);

/**
 * @route  POST /api/reminders/schedule
 * @desc   Schedule a future reminder
 * @access Private
 */
router.post('/schedule', reminderValidators.schedule, reminderController.scheduleReminder);

/**
 * @route  GET /api/reminders/:id
 * @desc   Get reminder by ID
 * @access Private
 */
router.get('/:id', reminderController.getById);

module.exports = router;
