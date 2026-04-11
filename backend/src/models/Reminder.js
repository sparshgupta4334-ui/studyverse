const { query } = require('../config/database');
const { getPagination, buildPaginationMeta } = require('../utils/helpers');

class ReminderModel {
  async create({ customerId, userId, message, scheduledAt, status = 'pending' }) {
    const result = await query(
      `INSERT INTO reminders (customer_id, user_id, message, scheduled_at, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [customerId, userId, message, scheduledAt || null, status]
    );
    return result.rows[0];
  }

  async findById(reminderId, userId) {
    const result = await query(
      'SELECT r.*, c.name as customer_name, c.phone as customer_phone FROM reminders r JOIN customers c ON r.customer_id = c.customer_id WHERE r.reminder_id = $1 AND r.user_id = $2',
      [reminderId, userId]
    );
    return result.rows[0] || null;
  }

  async findAll(userId, { page, limit, status } = {}) {
    const { limit: lim, offset, page: pageNum } = getPagination(page, limit);
    const params = [userId];
    let whereClause = 'WHERE r.user_id = $1';

    if (status) { params.push(status); whereClause += ` AND r.status = $${params.length}`; }

    const countResult = await query(`SELECT COUNT(*) FROM reminders r ${whereClause}`, params);

    params.push(lim, offset);
    const result = await query(
      `SELECT r.*, c.name as customer_name, c.phone as customer_phone
       FROM reminders r JOIN customers c ON r.customer_id = c.customer_id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      reminders: result.rows,
      pagination: buildPaginationMeta(parseInt(countResult.rows[0].count), pageNum, lim),
    };
  }

  async updateStatus(reminderId, status, sentAt = null) {
    const result = await query(
      `UPDATE reminders SET status = $1, sent_at = $2, updated_at = NOW()
       WHERE reminder_id = $3 RETURNING *`,
      [status, sentAt, reminderId]
    );
    return result.rows[0];
  }

  async getPendingScheduled() {
    const result = await query(
      `SELECT r.*, c.phone as customer_phone, c.name as customer_name, u.name as user_name
       FROM reminders r
       JOIN customers c ON r.customer_id = c.customer_id
       JOIN users u ON r.user_id = u.user_id
       WHERE r.status = 'pending' AND r.scheduled_at <= NOW()
       LIMIT 50`
    );
    return result.rows;
  }
}

module.exports = new ReminderModel();
