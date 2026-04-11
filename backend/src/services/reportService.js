'use strict';

const PDFDocument = require('pdfkit');
const { query } = require('../config/database');
const { formatCurrency } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Fetch summary data for a date range.
 */
const getSummaryData = async (userId, startDate, endDate) => {
  const [txResult, customerResult] = await Promise.all([
    query(
      `SELECT
         type,
         COUNT(*) AS count,
         SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1
         AND created_at >= $2
         AND created_at <  $3
       GROUP BY type`,
      [userId, startDate, endDate],
    ),
    query(
      `SELECT COUNT(*) AS total FROM customers
       WHERE user_id = $1 AND is_active = TRUE`,
      [userId],
    ),
  ]);

  const rows = txResult.rows;
  const credit = rows.find((r) => r.type === 'credit') || { count: 0, total: 0 };
  const debit = rows.find((r) => r.type === 'debit') || { count: 0, total: 0 };

  return {
    totalCustomers: parseInt(customerResult.rows[0].total, 10),
    credit: { count: parseInt(credit.count, 10), total: parseInt(credit.total || 0, 10) },
    debit: { count: parseInt(debit.count, 10), total: parseInt(debit.total || 0, 10) },
    netBalance: parseInt(credit.total || 0, 10) - parseInt(debit.total || 0, 10),
  };
};

/**
 * Fetch top debtors for a user.
 */
const getTopDebtors = async (userId, limit = 10) => {
  const res = await query(
    `SELECT id, name, phone, balance
     FROM customers
     WHERE user_id = $1 AND is_active = TRUE AND balance < 0
     ORDER BY balance ASC
     LIMIT $2`,
    [userId, limit],
  );
  return res.rows;
};

/**
 * Generate a PDF ledger report and pipe it into the provided response stream.
 */
const generatePDF = async ({ userId, userName, businessName, startDate, endDate, res }) => {
  const [summaryData, transactions, topDebtors] = await Promise.all([
    getSummaryData(userId, startDate, endDate),
    query(
      `SELECT t.*, c.name AS customer_name
       FROM transactions t
       JOIN customers c ON c.id = t.customer_id
       WHERE t.user_id = $1
         AND t.created_at >= $2
         AND t.created_at <  $3
       ORDER BY t.created_at DESC
       LIMIT 500`,
      [userId, startDate, endDate],
    ),
    getTopDebtors(userId, 10),
  ]);

  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="khata-report-${startDate.toISOString().slice(0, 10)}.pdf"`,
  );
  doc.pipe(res);

  // ── Header ──
  doc.fontSize(20).font('Helvetica-Bold').text(businessName || 'Khata Report', { align: 'center' });
  doc.fontSize(11).font('Helvetica').text(`Prepared for: ${userName || 'User'}`, { align: 'center' });
  doc
    .fontSize(10)
    .text(
      `Period: ${startDate.toDateString()} – ${endDate.toDateString()}`,
      { align: 'center' },
    );
  doc.moveDown();

  // ── Summary box ──
  doc.fontSize(13).font('Helvetica-Bold').text('Summary');
  doc.font('Helvetica').fontSize(10);
  doc.text(`Total Customers: ${summaryData.totalCustomers}`);
  doc.text(`Total Credit: ${formatCurrency(summaryData.credit.total)} (${summaryData.credit.count} entries)`);
  doc.text(`Total Debit: ${formatCurrency(summaryData.debit.total)} (${summaryData.debit.count} entries)`);
  doc.text(`Net Balance:  ${formatCurrency(summaryData.netBalance)}`);
  doc.moveDown();

  // ── Top Debtors ──
  if (topDebtors.length) {
    doc.fontSize(13).font('Helvetica-Bold').text('Top Outstanding');
    doc.font('Helvetica').fontSize(10);
    topDebtors.forEach((d, i) => {
      doc.text(`${i + 1}. ${d.name} (${d.phone || 'N/A'}) – ${formatCurrency(Math.abs(d.balance))}`);
    });
    doc.moveDown();
  }

  // ── Transaction table ──
  doc.fontSize(13).font('Helvetica-Bold').text('Transactions');
  doc.moveDown(0.3);

  const tableTop = doc.y;
  const cols = { date: 40, customer: 140, type: 310, amount: 370, balance: 460 };

  // Header row
  doc.font('Helvetica-Bold').fontSize(9);
  doc.text('Date', cols.date, tableTop);
  doc.text('Customer', cols.customer, tableTop);
  doc.text('Type', cols.type, tableTop);
  doc.text('Amount', cols.amount, tableTop);
  doc.text('Balance', cols.balance, tableTop);
  doc.moveDown(0.5);

  doc.font('Helvetica').fontSize(8);
  let y = doc.y;

  for (const tx of transactions.rows) {
    if (y > 720) {
      doc.addPage();
      y = 40;
    }
    const date = new Date(tx.created_at).toLocaleDateString('en-IN');
    doc.text(date, cols.date, y, { width: 90 });
    doc.text(tx.customer_name || '-', cols.customer, y, { width: 160 });
    doc.fillColor(tx.type === 'credit' ? 'green' : 'red').text(tx.type.toUpperCase(), cols.type, y, { width: 55 });
    doc.fillColor('black').text(formatCurrency(tx.amount), cols.amount, y, { width: 85 });
    doc.text(formatCurrency(tx.running_balance), cols.balance, y, { width: 85 });
    y += 14;
  }

  doc.end();
  logger.info('PDF report generated', { userId });
};

module.exports = { getSummaryData, getTopDebtors, generatePDF };
