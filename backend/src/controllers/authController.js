const { verifyOtpAndLogin, refreshAccessToken } = require('../services/authService');
const UserModel = require('../models/User');
const logger = require('../utils/logger');

const login = async (req, res) => {
  const { phone, firebaseToken } = req.body;

  const result = await verifyOtpAndLogin(phone, firebaseToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const result = refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: result,
  });
};

const getProfile = async (req, res) => {
  const user = await UserModel.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: user.user_id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },
  });
};

const updateProfile = async (req, res) => {
  const { name, email, fcmToken } = req.body;

  const user = await UserModel.update(req.user.userId, { name, email, fcmToken });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: {
      userId: user.user_id,
      phone: user.phone,
      name: user.name,
      email: user.email,
    },
  });
};

const logout = async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side by discarding tokens
  // Optionally: clear FCM token on logout
  if (req.body.fcmToken === '') {
    await UserModel.update(req.user.userId, { fcmToken: null });
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = { login, refresh, getProfile, updateProfile, logout };
