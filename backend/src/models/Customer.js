const { query, getClient } = require('../config/database');
const { getPagination, buildPaginationMeta } = require('../utils/helpers');

class CustomerModel {
  async findById(customerId, userId) {
    const result = await query(
      'SELECT * FROM customers WHERE customer_id = $1 AND user_id = $2 AND is_active = true',
      [customerId, userId]
    );
    return result.rows[0] || null;
  }

  async findAll(userId, { search, page, limit, sortBy = 'name', sortOrder = 'ASC' } = {}) {
    const { limit: lim, offset, page: pageNum } = getPagination(page, limit);
    const params = [userId];
    let whereClause = 'WHERE c.user_id = $1 AND c.is_active = true';

    if (search) {
      params.push(`%${search}%`);
      whereClause += ` AND (c.name ILIKE $${params.length} OR c.phone ILIKE $${params.length})`;
    }

    const allowedSortBy = ['name', 'balance', 'last_transaction_date', 'created_at'];
    const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const countResult = await query(
      `SELECT COUNT(*) FROM customers c ${whereClause}`,
      params
    );

    params.push(lim, offset);
    const result = await query(
      `SELECT * FROM customers c ${whereClause}
       ORDER BY c.${safeSortBy} ${safeSortOrder}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return {
      customers: result.rows,
      pagination: buildPaginationMeta(parseInt(countResult.rows[0].count), pageNum, lim),
    };
  }

  async create({ userId, name, phone, email, notes }) {
    const result = await query(
      `INSERT INTO customers (user_id, name, phone, email, notes, balance, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 0, NOW(), NOW())
       RETURNING *`,
      [userId, name, phone, email || null, notes || null]
    );
    return result.rows[0];
  }

  async update(customerId, userId, { name, phone, email, notes }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (phone !== undefined) { fields.push(`phone = $${idx++}`); values.push(phone); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes); }
    fields.push('updated_at = NOW()');

    values.push(customerId, userId);

    const result = await query(
      `UPDATE customers SET ${fields.join(', ')}
       WHERE customer_id = $${idx} AND user_id = $${idx + 1} AND is_active = true
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async updateBalance(customerId, balanceDelta, client = null) {
    const db = client || { query };
    const result = await db.query(
      `UPDATE customers SET balance = balance + $1, last_transaction_date = NOW(), updated_at = NOW()
       WHERE customer_id = $2 RETURNING balance`,
      [balanceDelta, customerId]
    );
    return result.rows[0];
  }

  async delete(customerId, userId) {
    await query(
      'UPDATE customers SET is_active = false, updated_at = NOW() WHERE customer_id = $1 AND user_id = $2',
      [customerId, userId]
    );
  }

  async getDashboardStats(userId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN balance > 0 THEN balance ELSE 0 END) as total_receivable,
        SUM(CASE WHEN balance < 0 THEN ABS(balance) ELSE 0 END) as total_payable,
        COUNT(CASE WHEN balance > 0 THEN 1 END) as customers_to_receive,
        COUNT(CASE WHEN balance < 0 THEN 1 END) as customers_to_pay
       FROM customers
       WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = new CustomerModel();
