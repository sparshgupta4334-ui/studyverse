const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { verifyFirebaseToken } = require('../config/firebase');
const UserModel = require('../models/User');
const logger = require('../utils/logger');

const generateTokens = (userId, phone) => {
  const payload = { userId, phone };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'studyverse-api',
    audience: 'studyverse-app',
  });

  const refreshToken = jwt.sign({ userId, type: 'refresh' }, process.env.JWT_SECRET || 'default_secret_change_in_production', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'studyverse-api',
    audience: 'studyverse-app',
  });

  return { accessToken, refreshToken };
};

const verifyOtpAndLogin = async (phone, firebaseToken) => {
  // Verify Firebase ID token (issued after OTP verification)
  let decodedFirebaseToken;
  try {
    decodedFirebaseToken = await verifyFirebaseToken(firebaseToken);
  } catch (error) {
    logger.warn('Firebase token verification failed', { phone, error: error.message });
    throw new Error('Invalid or expired OTP verification token');
  }

  // Ensure phone matches
  const tokenPhone = decodedFirebaseToken.phone_number;
  const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
  if (tokenPhone !== normalizedPhone) {
    throw new Error('Phone number mismatch');
  }

  // Find or create user
  let user = await UserModel.findByPhone(normalizedPhone);
  if (!user) {
    user = await UserModel.create({ phone: normalizedPhone });
    logger.info('New user created', { userId: user.user_id, phone: normalizedPhone });
  }

  await UserModel.updateLastLogin(user.user_id);

  const tokens = generateTokens(user.user_id, user.phone);

  return {
    user: {
      userId: user.user_id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
};

const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'default_secret_change_in_production', {
      issuer: 'studyverse-api',
      audience: 'studyverse-app',
    });

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, phone: decoded.phone },
      process.env.JWT_SECRET || 'default_secret_change_in_production',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'studyverse-api',
        audience: 'studyverse-app',
      }
    );

    return { accessToken };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

module.exports = { verifyOtpAndLogin, refreshAccessToken, generateTokens };
