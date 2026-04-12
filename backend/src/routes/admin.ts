import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { query } from '../config/database';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [result, countResult] = await Promise.all([
      query(
        `SELECT user_id, phone, name, email, role, is_active, created_at
         FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [parseInt(limit, 10), offset]
      ),
      query('SELECT COUNT(*) FROM users'),
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
});

router.patch(
  '/users/:id/toggle-active',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await query(
        `UPDATE users
         SET is_active = NOT is_active, updated_at = NOW()
         WHERE user_id = $1
         RETURNING user_id, phone, name, is_active`,
        [req.params.id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM customers) AS total_customers,
        (SELECT COUNT(*) FROM transactions) AS total_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'credit') AS total_credit,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'debit') AS total_debit
    `);

    const row = result.rows[0] as Record<string, string>;
    res.json({
      success: true,
      data: {
        total_users: parseInt(row.total_users, 10),
        total_customers: parseInt(row.total_customers, 10),
        total_transactions: parseInt(row.total_transactions, 10),
        total_credit: parseInt(row.total_credit, 10),
        total_debit: parseInt(row.total_debit, 10),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
