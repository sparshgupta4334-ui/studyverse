const { query } = require('../config/database');

class UserModel {
  async findById(userId) {
    const result = await query('SELECT * FROM users WHERE user_id = $1 AND is_active = true', [userId]);
    return result.rows[0] || null;
  }

  async findByPhone(phone) {
    const result = await query('SELECT * FROM users WHERE phone = $1 AND is_active = true', [phone]);
    return result.rows[0] || null;
  }

  async create({ phone, name, email }) {
    const result = await query(
      `INSERT INTO users (phone, name, email, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING *`,
      [phone, name || null, email || null]
    );
    return result.rows[0];
  }

  async update(userId, { name, email, fcmToken }) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email); }
    if (fcmToken !== undefined) { fields.push(`fcm_token = $${idx++}`); values.push(fcmToken); }
    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async updateLastLogin(userId) {
    await query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [userId]);
  }

  async deactivate(userId) {
    await query('UPDATE users SET is_active = false, updated_at = NOW() WHERE user_id = $1', [userId]);
  }
}

module.exports = new UserModel();
