import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

router.get('/', getCustomers);
router.get('/:id', [param('id').isUUID().withMessage('Valid customer id required')], validate, getCustomer);

router.post(
  '/',
  [body('name').notEmpty().trim().withMessage('Name is required')],
  validate,
  createCustomer
);

router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid customer id required'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  ],
  validate,
  updateCustomer
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Valid customer id required')],
  validate,
  deleteCustomer
);

export default router;
