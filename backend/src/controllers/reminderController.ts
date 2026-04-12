import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { sendSMS } from '../config/twilio';

interface CustomerRow {
  customer_id: string;
  user_id: string;
  name: string;
  phone: string | null;
  balance: number;
}

export const sendReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, message } = req.body as {
      customer_id: string;
      message: string;
    };

    const customerResult = await query<CustomerRow>(
      'SELECT * FROM customers WHERE customer_id = $1 AND user_id = $2',
      [customer_id, req.user!.user_id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const customer = customerResult.rows[0];
    let status: 'sent' | 'failed' = 'sent';
    let sent_at: Date | null = null;

    try {
      if (customer.phone) {
        await sendSMS(customer.phone, message);
      }
      sent_at = new Date();
    } catch (smsErr) {
      console.error('Reminder SMS error:', smsErr);
      status = 'failed';
    }

    const result = await query(
      `INSERT INTO reminders (user_id, customer_id, message, sent_at, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user!.user_id, customer_id, message, sent_at, status]
    );

    res.status(201).json({
      success: true,
      message: status === 'sent' ? 'Reminder sent successfully' : 'Reminder logged but SMS failed',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const getReminders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const params: unknown[] = [req.user!.user_id];
    const conditions: string[] = ['r.user_id = $1'];

    if (customer_id) {
      params.push(customer_id);
      conditions.push(`r.customer_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`r.status = $${params.length}`);
    }

    const where = conditions.join(' AND ');
    params.push(parseInt(limit, 10), offset);

    const result = await query(
      `SELECT r.*, c.name AS customer_name, c.phone AS customer_phone
       FROM reminders r
       JOIN customers c ON c.customer_id = r.customer_id
       WHERE ${where}
       ORDER BY r.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};
