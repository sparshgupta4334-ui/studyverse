import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { query } from '../config/database';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

const getRazorpay = () => {
  const Razorpay = require('razorpay') as {
    new (opts: { key_id: string; key_secret: string }): {
      orders: { create: (opts: Record<string, unknown>) => Promise<RazorpayOrder> };
    };
  };
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, customer_id } = req.body as {
      amount: number;
      customer_id: string;
    };

    // Validate customer belongs to user
    const customerResult = await query(
      'SELECT customer_id FROM customers WHERE customer_id = $1 AND user_id = $2',
      [customer_id, req.user!.user_id]
    );
    if (customerResult.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const paymentResult = await query(
      `INSERT INTO payments (user_id, customer_id, amount, razorpay_order_id, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [req.user!.user_id, customer_id, amount, order.id]
    );

    res.status(201).json({
      success: true,
      data: { order, payment: paymentResult.rows[0] },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
      return;
    }

    const result = await query(
      `UPDATE payments
       SET razorpay_payment_id = $1, status = 'success', updated_at = NOW()
       WHERE razorpay_order_id = $2 AND user_id = $3
       RETURNING *`,
      [razorpay_payment_id, razorpay_order_id, req.user!.user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Payment record not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const params: unknown[] = [req.user!.user_id];
    const conditions: string[] = ['p.user_id = $1'];

    if (customer_id) {
      params.push(customer_id);
      conditions.push(`p.customer_id = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`p.status = $${params.length}`);
    }

    const where = conditions.join(' AND ');
    params.push(parseInt(limit, 10), offset);

    const result = await query(
      `SELECT p.*, c.name AS customer_name
       FROM payments p
       JOIN customers c ON c.customer_id = p.customer_id
       WHERE ${where}
       ORDER BY p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};
