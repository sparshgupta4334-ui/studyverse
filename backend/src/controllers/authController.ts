import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { sendSMS } from '../config/twilio';

const SALT_ROUNDS = 12;

const signToken = (user_id: string, phone: string, role: string): string =>
  jwt.sign(
    { user_id, phone, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, name, password, email } = req.body as {
      phone: string;
      name: string;
      password: string;
      email?: string;
    };

    const existing = await query(
      'SELECT user_id FROM users WHERE phone = $1',
      [phone]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, message: 'Phone already registered' });
      return;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await query(
      `INSERT INTO users (phone, name, password_hash, email, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING user_id, phone, name, email, role, created_at`,
      [phone, name, password_hash, email || null]
    );

    const user = result.rows[0] as {
      user_id: string;
      phone: string;
      name: string;
      email: string;
      role: string;
      created_at: Date;
    };
    const token = signToken(user.user_id, user.phone, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { token, user },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, password } = req.body as { phone: string; password: string };

    const result = await query(
      'SELECT * FROM users WHERE phone = $1 AND is_active = true',
      [phone]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0] as {
      user_id: string;
      phone: string;
      name: string;
      email: string;
      role: string;
      password_hash: string;
      created_at: Date;
    };
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user.user_id, user.phone, user.role);
    const { password_hash: _omit, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: { token, user: safeUser },
    });
  } catch (err) {
    next(err);
  }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone } = req.body as { phone: string };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await query(
      'UPDATE otps SET used = true WHERE phone = $1 AND used = false',
      [phone]
    );

    await query(
      'INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)',
      [phone, otp, expires_at]
    );

    // Twilio SMS integration (non-blocking; log on failure)
    try {
      await sendSMS(
        phone,
        `Your Gupta Paper Stores OTP is: ${otp}. Valid for 10 minutes.`
      );
    } catch (smsErr) {
      console.error('SMS send error:', smsErr);
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone, otp } = req.body as { phone: string; otp: string };

    const result = await query(
      `SELECT * FROM otps
       WHERE phone = $1 AND otp = $2 AND used = false AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone, otp]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    await query('UPDATE otps SET used = true WHERE otp_id = $1', [
      (result.rows[0] as { otp_id: string }).otp_id,
    ]);

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  // JWT is stateless; client should discard token
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query(
      'SELECT user_id, phone, name, email, role, is_active, created_at FROM users WHERE user_id = $1',
      [req.user!.user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
