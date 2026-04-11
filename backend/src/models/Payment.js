const { query } = require('../config/database');

class PaymentModel {
  async create({ transactionId, customerId, userId, amount, upiId, orderId, status = 'pending', gatewayResponse }) {
    const result = await query(
      `INSERT INTO payments (transaction_id, customer_id, user_id, amount, upi_id, order_id, status, gateway_response, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [transactionId || null, customerId, userId, amount, upiId || null, orderId || null, status, JSON.stringify(gatewayResponse || {})]
    );
    return result.rows[0];
  }

  async findById(paymentId, userId) {
    const result = await query(
      'SELECT * FROM payments WHERE payment_id = $1 AND user_id = $2',
      [paymentId, userId]
    );
    return result.rows[0] || null;
  }

  async findByOrderId(orderId) {
    const result = await query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
    return result.rows[0] || null;
  }

  async updateStatus(paymentId, status, gatewayResponse) {
    const result = await query(
      `UPDATE payments SET status = $1, gateway_response = $2, updated_at = NOW()
       WHERE payment_id = $3 RETURNING *`,
      [status, JSON.stringify(gatewayResponse || {}), paymentId]
    );
    return result.rows[0];
  }

  async findByCustomer(customerId, userId, limit = 20) {
    const result = await query(
      `SELECT * FROM payments 
       WHERE customer_id = $1 AND user_id = $2
       ORDER BY created_at DESC LIMIT $3`,
      [customerId, userId, limit]
    );
    return result.rows;
  }
}

module.exports = new PaymentModel();
