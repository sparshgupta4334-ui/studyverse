'use strict';

const reportService = require('../services/reportService');
const User = require('../models/User');
const { query } = require('../config/database');
const logger = require('../utils/logger');

const getDateRange = (period) => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start;
  switch (period) {
    case 'today':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end };
};

/**
 * GET /reports/summary?period=today|week|month|year
 */
const getSummary = async (req, res, next) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      ({ start, end } = getDateRange(period));
    }

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(422).json({ success: false, message: 'Invalid date range' });
    }

    const data = await reportService.getSummaryData(req.user.id, start, end);
    const topDebtors = await reportService.getTopDebtors(req.user.id, 5);

    res.json({
      success: true,
      data: {
        period: { start, end },
        ...data,
        topDebtors,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reports/daily?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
const getDailySummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : (() => { const d = new Date(); d.setDate(d.getDate() - 29); return d; })();
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const rows = await query(
      `SELECT
         DATE(created_at AT TIME ZONE 'Asia/Kolkata') AS date,
         type,
         COUNT(*) AS count,
         SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1
         AND created_at >= $2
         AND created_at <  $3
       GROUP BY date, type
       ORDER BY date ASC`,
      [req.user.id, start, end],
    );

    res.json({ success: true, data: rows.rows, period: { start, end } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reports/export?period=month&format=pdf
 */
const exportReport = async (req, res, next) => {
  try {
    const { period = 'month', startDate, endDate, format = 'pdf' } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      ({ start, end } = getDateRange(period));
    }

    if (format !== 'pdf') {
      return res.status(400).json({ success: false, message: 'Only PDF export is supported currently' });
    }

    const user = await User.findById(req.user.id);

    await reportService.generatePDF({
      userId: req.user.id,
      userName: user?.name,
      businessName: user?.business_name,
      startDate: start,
      endDate: end,
      res,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /reports/top-debtors
 */
const getTopDebtors = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const debtors = await reportService.getTopDebtors(req.user.id, limit);
    res.json({ success: true, data: debtors });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getDailySummary, exportReport, getTopDebtors };
