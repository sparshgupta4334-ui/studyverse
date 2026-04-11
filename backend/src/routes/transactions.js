'use strict';

const { Router } = require('express');
const { query, param } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('cursor').optional().isString(),
  ],
  validate,
  transactionController.listTransactions,
);

router.get(
  '/:id',
  [param('id').isUUID()],
  validate,
  transactionController.getTransaction,
);

module.exports = router;
