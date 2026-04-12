import { Router } from 'express';
import { body } from 'express-validator';
import { sendReminder, getReminders } from '../controllers/reminderController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

router.get('/', getReminders);

router.post(
  '/',
  [
    body('customer_id').notEmpty().isUUID().withMessage('Valid customer_id required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
  ],
  validate,
  sendReminder
);

export default router;
