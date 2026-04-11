'use strict';

const { getFirebaseAdmin } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * Verify a Firebase ID token (issued after phone OTP verification on the client).
 * Returns the decoded token payload including phone_number.
 */
const verifyIdToken = async (idToken) => {
  const admin = getFirebaseAdmin();
  if (!admin) {
    throw Object.assign(new Error('Firebase is not configured'), { statusCode: 503 });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.phone_number) {
      throw Object.assign(
        new Error('Firebase token does not contain a phone number'),
        { statusCode: 400 },
      );
    }
    return decoded;
  } catch (err) {
    if (err.statusCode) throw err;
    logger.warn('Firebase token verification failed', { error: err.message });
    throw Object.assign(new Error('Invalid or expired Firebase token'), { statusCode: 401 });
  }
};

/**
 * Revoke all Firebase refresh tokens for a user (forces re-login on all devices).
 */
const revokeUserTokens = async (uid) => {
  const admin = getFirebaseAdmin();
  if (!admin) return;
  try {
    await admin.auth().revokeRefreshTokens(uid);
  } catch (err) {
    logger.warn('Failed to revoke Firebase tokens', { uid, error: err.message });
  }
};

module.exports = { verifyIdToken, revokeUserTokens };
