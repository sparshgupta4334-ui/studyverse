const { query, getClient } = require('../config/database');
const { getPagination, buildPaginationMeta } = require('../utils/helpers');

class TransactionModel {
  async findById(transactionId, userId) {
    const result = await query(
      `SELECT t.*, c.name as customer_name, c.phone as customer_phone
       FROM transactions t
       JOIN customers c ON t.customer_id = c.customer_id
       WHERE t.transaction_id = $1 AND c.user_id = $2`,
      [transactionId, userId]
    );
    return result.rows[0] || null;
  }

  async findByCustomer(customerId, userId, { page, limit, startDate, endDate, type } = {}) {
    const { limit: lim, offset, page: pageNum } = getPagination(page, limit);
    const params = [customerId, userId];
    let whereClause = `WHERE t.customer_id = $1 AND c.user_id = $2`;

    if (startDate) { params.push(startDate); whereClause += ` AND t.created_at >= $${params.length}`; }
    if (endDate) { params.push(endDate); whereClause += ` AND t.created_at <= $${params.length}`; }
    if (type && ['credit', 'debit'].includes(type)) { params.push(type); whereClause += ` AND t.type = $${params.length}`; }

    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t JOIN customers c ON t.customer_id = c.customer_id ${whereClause}`,
      params
    );

    params.push(lim, offset);
    const result = await query(
      `SELECT t.*, c.name as customer_name
       FROM transactions t
       JOIN customers c ON t.customer_id = c.customer_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      transactions: result.rows,
      pagination: buildPaginationMeta(parseInt(countResult.rows[0].count), pageNum, lim),
    };
  }

  async findAll(userId, { page, limit, startDate, endDate, type } = {}) {
    const { limit: lim, offset, page: pageNum } = getPagination(page, limit);
    const params = [userId];
    let whereClause = `WHERE c.user_id = $1`;

    if (startDate) { params.push(startDate); whereClause += ` AND t.created_at >= $${params.length}`; }
    if (endDate) { params.push(endDate); whereClause += ` AND t.created_at <= $${params.length}`; }
    if (type && ['credit', 'debit'].includes(type)) { params.push(type); whereClause += ` AND t.type = $${params.length}`; }

    params.push(lim, offset);
    const result = await query(
      `SELECT t.*, c.name as customer_name, c.phone as customer_phone
       FROM transactions t
       JOIN customers c ON t.customer_id = c.customer_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return result.rows;
  }

  async create({ customerId, amount, type, notes, syncStatus = 'synced', referenceId, createdBy }, client = null) {
    const db = client ? { query: client.query.bind(client) } : { query };
    const result = await db.query(
      `INSERT INTO transactions (customer_id, amount, type, notes, sync_status, reference_id, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [customerId, amount, type, notes || null, syncStatus, referenceId || null, createdBy || null]
    );
    return result.rows[0];
  }

  async delete(transactionId, userId) {
    // Soft delete - mark as deleted
    const result = await query(
      `UPDATE transactions SET is_deleted = true, deleted_at = NOW()
       FROM customers c
       WHERE transactions.customer_id = c.customer_id
         AND transactions.transaction_id = $1
         AND c.user_id = $2
       RETURNING transactions.*`,
      [transactionId, userId]
    );
    return result.rows[0] || null;
  }

  async getReportSummary(userId, startDate, endDate) {
    const result = await query(
      `SELECT 
        SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END) as total_credit,
        SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END) as total_debit,
        COUNT(*) as total_transactions,
        COUNT(DISTINCT t.customer_id) as customers_involved
       FROM transactions t
       JOIN customers c ON t.customer_id = c.customer_id
       WHERE c.user_id = $1 AND t.created_at BETWEEN $2 AND $3
         AND t.is_deleted = false`,
      [userId, startDate, endDate]
    );
    return result.rows[0];
  }

  async getDailyBreakdown(userId, startDate, endDate) {
    const result = await query(
      `SELECT 
        DATE(t.created_at) as date,
        SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END) as credit,
        SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END) as debit,
        COUNT(*) as count
       FROM transactions t
       JOIN customers c ON t.customer_id = c.customer_id
       WHERE c.user_id = $1 AND t.created_at BETWEEN $2 AND $3
         AND t.is_deleted = false
       GROUP BY DATE(t.created_at)
       ORDER BY date ASC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = new TransactionModel();
