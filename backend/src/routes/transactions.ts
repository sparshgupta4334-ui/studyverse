import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

router.get('/', getTransactions);

router.post(
  '/',
  [
    body('customer_id').notEmpty().isUUID().withMessage('Valid customer_id required'),
    body('amount')
      .isInt({ min: 1 })
      .withMessage('Amount must be a positive integer (paise)'),
    body('type')
      .isIn(['credit', 'debit'])
      .withMessage('Type must be credit or debit'),
  ],
  validate,
  createTransaction
);

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid transaction id required'),
    body('notes').optional().isString(),
    body('category').optional().isString(),
  ],
  validate,
  updateTransaction
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Valid transaction id required')],
  validate,
  deleteTransaction
);

export default router;
