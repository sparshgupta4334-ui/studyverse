'use strict';

const { Router } = require('express');
const { body, query } = require('express-validator');
const syncController = require('../controllers/syncController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get(
  '/',
  [query('lastSyncedAt').optional().isISO8601()],
  validate,
  syncController.pull,
);

router.post(
  '/',
  [
    body('customers').optional().isArray(),
    body('transactions').optional().isArray(),
  ],
  validate,
  syncController.push,
);

module.exports = router;
