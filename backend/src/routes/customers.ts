import { Router } from 'express';
import { body } from 'express-validator';
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
router.get('/:id', getCustomer);

router.post(
  '/',
  [body('name').notEmpty().trim().withMessage('Name is required')],
  validate,
  createCustomer
);

router.put(
  '/:id',
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')],
  validate,
  updateCustomer
);

router.delete('/:id', deleteCustomer);

export default router;
