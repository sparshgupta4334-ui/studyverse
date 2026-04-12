import { Request, Response, NextFunction } from 'express';
import { transaction, query } from '../config/database';
import { PoolClient } from 'pg';

interface TransactionRow {
  transaction_id: string;
  customer_id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  notes: string | null;
  category: string | null;
  balance_after: number;
  created_at: Date;
  updated_at: Date;
}

interface CustomerRow {
  customer_id: string;
  balance: number;
  user_id: string;
}

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      customer_id,
      type,
      page = '1',
      limit = '20',
      from,
      to,
    } = req.query as Record<string, string>;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const params: unknown[] = [req.user!.user_id];
    const conditions: string[] = ['t.user_id = $1'];

    if (customer_id) {
      params.push(customer_id);
      conditions.push(`t.customer_id = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`t.type = $${params.length}`);
    }
    if (from) {
      params.push(from);
      conditions.push(`t.created_at >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      conditions.push(`t.created_at <= $${params.length}`);
    }

    const where = conditions.join(' AND ');
    params.push(parseInt(limit, 10), offset);

    const [result, countResult] = await Promise.all([
      query(
        `SELECT t.*, c.name AS customer_name
         FROM transactions t
         JOIN customers c ON c.customer_id = t.customer_id
         WHERE ${where}
         ORDER BY t.created_at DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      ),
      query(
        `SELECT COUNT(*) FROM transactions t WHERE ${where}`,
        params.slice(0, -2)
      ),
    ]);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt((countResult.rows[0] as { count: string }).count, 10),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id, amount, type, notes, category } = req.body as {
      customer_id: string;
      amount: number;
      type: 'credit' | 'debit';
      notes?: string;
      category?: string;
    };

    const amountPaise = Math.round(amount);

    const result = await transaction(async (client: PoolClient) => {
      const customerResult = await client.query<CustomerRow>(
        'SELECT customer_id, balance, user_id FROM customers WHERE customer_id = $1 AND user_id = $2 FOR UPDATE',
        [customer_id, req.user!.user_id]
      );

      if (customerResult.rows.length === 0) {
        const err = new Error('Customer not found') as Error & { statusCode: number };
        err.statusCode = 404;
        throw err;
      }

      const customer = customerResult.rows[0];
      const newBalance =
        type === 'credit'
          ? customer.balance + amountPaise
          : customer.balance - amountPaise;

      await client.query(
        'UPDATE customers SET balance = $1, updated_at = NOW() WHERE customer_id = $2',
        [newBalance, customer_id]
      );

      const txResult = await client.query<TransactionRow>(
        `INSERT INTO transactions (customer_id, user_id, amount, type, notes, category, balance_after)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          customer_id,
          req.user!.user_id,
          amountPaise,
          type,
          notes || null,
          category || null,
          newBalance,
        ]
      );

      return txResult.rows[0];
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { notes, category } = req.body as { notes?: string; category?: string };

    const existing = await query(
      'SELECT transaction_id FROM transactions WHERE transaction_id = $1 AND user_id = $2',
      [req.params.id, req.user!.user_id]
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return;
    }

    const result = await query(
      `UPDATE transactions
       SET notes = COALESCE($1, notes),
           category = COALESCE($2, category),
           updated_at = NOW()
       WHERE transaction_id = $3 AND user_id = $4
       RETURNING *`,
      [notes || null, category || null, req.params.id, req.user!.user_id]
    );

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await transaction(async (client: PoolClient) => {
      const txResult = await client.query<TransactionRow>(
        'SELECT * FROM transactions WHERE transaction_id = $1 AND user_id = $2',
        [req.params.id, req.user!.user_id]
      );

      if (txResult.rows.length === 0) {
        const err = new Error('Transaction not found') as Error & { statusCode: number };
        err.statusCode = 404;
        throw err;
      }

      const tx = txResult.rows[0];

      // Reverse the balance effect
      const reversal = tx.type === 'credit' ? -tx.amount : tx.amount;
      await client.query(
        'UPDATE customers SET balance = balance + $1, updated_at = NOW() WHERE customer_id = $2',
        [reversal, tx.customer_id]
      );

      await client.query(
        'DELETE FROM transactions WHERE transaction_id = $1',
        [req.params.id]
      );

      return tx;
    });

    res.json({
      success: true,
      message: 'Transaction deleted and balance reversed',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
