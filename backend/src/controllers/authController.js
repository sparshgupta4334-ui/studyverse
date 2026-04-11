'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const firebaseService = require('../services/firebaseService');
const logger = require('../utils/logger');

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// ─── Helpers ────────────────────────────────────────────────────────────────

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const parseExpiryToDate = (expiry) => {
  const match = String(expiry).match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const [, num, unit] = match;
  const ms = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[unit];
  return new Date(Date.now() + parseInt(num, 10) * ms);
};

// ─── Controllers ────────────────────────────────────────────────────────────

/**
 * POST /auth/verify-otp
 * Accepts a Firebase ID token from the client (after phone OTP verification)
 * and returns our own JWT access + refresh tokens.
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { idToken, name, businessName } = req.body;

    const decoded = await firebaseService.verifyIdToken(idToken);
    const phone = decoded.phone_number;

    const user = await User.upsertByPhone({ phone, name, businessName });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    const tokenHash = hashToken(refreshToken);
    const expiresAt = parseExpiryToDate(REFRESH_EXPIRES);

    await User.storeRefreshToken(user.id, tokenHash, expiresAt);

    logger.info('User authenticated', { userId: user.id, phone });

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          businessName: user.business_name,
          avatarUrl: user.avatar_url,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: ACCESS_EXPIRES,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/refresh
 * Exchange a valid refresh token for a new access token.
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const tokenHash = hashToken(token);
    const stored = await User.findRefreshToken(tokenHash);
    if (!stored) {
      return res.status(401).json({ success: false, message: 'Refresh token revoked or not found' });
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Rotate: revoke old, issue new pair
    await User.revokeRefreshToken(tokenHash);
    const newAccessToken = signAccessToken(user.id);
    const newRefreshToken = signRefreshToken(user.id);
    const newHash = hashToken(newRefreshToken);
    const expiresAt = parseExpiryToDate(REFRESH_EXPIRES);
    await User.storeRefreshToken(user.id, newHash, expiresAt);

    res.json({
      success: true,
      data: {
        tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: ACCESS_EXPIRES },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/logout
 * Revoke the provided refresh token.
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) {
      const hash = hashToken(token);
      await User.revokeRefreshToken(hash);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/logout-all
 * Revoke all refresh tokens for the authenticated user.
 */
const logoutAll = async (req, res, next) => {
  try {
    await User.revokeAllUserRefreshTokens(req.user.id);
    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        businessName: user.business_name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /auth/me
 */
const updateMe = async (req, res, next) => {
  try {
    const { name, email, business_name, avatar_url } = req.body;
    const updated = await User.update(req.user.id, { name, email, business_name, avatar_url });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile updated', data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyOTP, refreshToken, logout, logoutAll, getMe, updateMe };
