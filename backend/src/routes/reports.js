'use strict';

const { Router } = require('express');
const { query } = require('express-validator');
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get(
  '/summary',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  reportController.getSummary,
);

router.get(
  '/daily',
  [
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validate,
  reportController.getDailySummary,
);

router.get(
  '/export',
  [
    query('period').optional().isIn(['today', 'week', 'month', 'year']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('format').optional().isIn(['pdf']),
  ],
  validate,
  reportController.exportReport,
);

router.get('/top-debtors', reportController.getTopDebtors);

module.exports = router;
