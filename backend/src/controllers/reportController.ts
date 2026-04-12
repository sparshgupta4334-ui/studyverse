import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import PDFDocument from 'pdfkit';

interface StatsRow {
  total_customers: string;
  total_credit: string;
  total_debit: string;
  total_transactions: string;
}

interface CustomerRow {
  customer_id: string;
  name: string;
  phone: string | null;
  balance: number;
  transaction_count: string;
}

interface TransactionRow {
  transaction_id: string;
  customer_name: string;
  amount: number;
  type: string;
  notes: string | null;
  category: string | null;
  balance_after: number;
  created_at: Date;
}

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.user_id;

    const [statsResult, topCustomers, recentTransactions] = await Promise.all([
      query<StatsRow>(
        `SELECT
          (SELECT COUNT(*) FROM customers WHERE user_id = $1) AS total_customers,
          COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit,
          COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
          COUNT(*) AS total_transactions
         FROM transactions WHERE user_id = $1`,
        [userId]
      ),
      query<CustomerRow>(
        `SELECT c.customer_id, c.name, c.phone, c.balance,
                COUNT(t.transaction_id)::text AS transaction_count
         FROM customers c
         LEFT JOIN transactions t ON t.customer_id = c.customer_id
         WHERE c.user_id = $1
         GROUP BY c.customer_id
         ORDER BY ABS(c.balance) DESC
         LIMIT 5`,
        [userId]
      ),
      query<TransactionRow>(
        `SELECT t.*, c.name AS customer_name
         FROM transactions t
         JOIN customers c ON c.customer_id = t.customer_id
         WHERE t.user_id = $1
         ORDER BY t.created_at DESC
         LIMIT 10`,
        [userId]
      ),
    ]);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        total_customers: parseInt(stats.total_customers, 10),
        total_credit: parseInt(stats.total_credit, 10),
        total_debit: parseInt(stats.total_debit, 10),
        total_transactions: parseInt(stats.total_transactions, 10),
        net_balance: parseInt(stats.total_credit, 10) - parseInt(stats.total_debit, 10),
        top_customers: topCustomers.rows,
        recent_transactions: recentTransactions.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      format = 'json',
      customer_id,
      from,
      to,
    } = req.query as Record<string, string>;

    const params: unknown[] = [req.user!.user_id];
    const conditions: string[] = ['t.user_id = $1'];

    if (customer_id) {
      params.push(customer_id);
      conditions.push(`t.customer_id = $${params.length}`);
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
    const result = await query<TransactionRow>(
      `SELECT t.transaction_id, c.name AS customer_name, t.amount, t.type,
              t.notes, t.category, t.balance_after, t.created_at
       FROM transactions t
       JOIN customers c ON c.customer_id = t.customer_id
       WHERE ${where}
       ORDER BY t.created_at DESC`,
      params
    );

    const rows = result.rows;

    if (format === 'csv') {
      const { Parser } = require('json2csv') as {
        Parser: new (opts: { fields: string[] }) => { parse: (data: unknown) => string };
      };
      const parser = new Parser({
        fields: ['transaction_id', 'customer_name', 'amount', 'type', 'notes', 'category', 'balance_after', 'created_at'],
      });
      const csv = parser.parse(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
      res.send(csv);
      return;
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
      doc.pipe(res);

      doc.fontSize(20).text('Gupta Paper Stores - Transaction Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();

      rows.forEach((row) => {
        doc
          .fontSize(10)
          .text(
            `${new Date(row.created_at).toLocaleDateString()} | ${row.customer_name} | ` +
            `${row.type.toUpperCase()} ₹${(row.amount / 100).toFixed(2)} | ` +
            `${row.notes || ''}`
          );
      });

      doc.end();
      return;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};
