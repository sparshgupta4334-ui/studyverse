import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

interface Customer {
  customer_id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let queryText = `
      SELECT * FROM customers
      WHERE user_id = $1
    `;
    const params: unknown[] = [req.user!.user_id];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` AND (name ILIKE $${params.length} OR phone ILIKE $${params.length})`;
    }

    queryText += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit, 10), offset);

    const [result, countResult] = await Promise.all([
      query(queryText, params),
      query(
        'SELECT COUNT(*) FROM customers WHERE user_id = $1',
        [req.user!.user_id]
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

export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query(
      'SELECT * FROM customers WHERE customer_id = $1 AND user_id = $2',
      [req.params.id, req.user!.user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, email, address } = req.body as Partial<Customer>;

    const result = await query(
      `INSERT INTO customers (user_id, name, phone, email, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user!.user_id, name, phone || null, email || null, address || null]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, email, address } = req.body as Partial<Customer>;

    const existing = await query(
      'SELECT customer_id FROM customers WHERE customer_id = $1 AND user_id = $2',
      [req.params.id, req.user!.user_id]
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    const result = await query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           address = COALESCE($4, address),
           updated_at = NOW()
       WHERE customer_id = $5 AND user_id = $6
       RETURNING *`,
      [name || null, phone || null, email || null, address || null, req.params.id, req.user!.user_id]
    );

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query(
      'DELETE FROM customers WHERE customer_id = $1 AND user_id = $2 RETURNING customer_id',
      [req.params.id, req.user!.user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    next(err);
  }
};
