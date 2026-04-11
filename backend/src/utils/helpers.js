const crypto = require('crypto');

/**
 * Format amount to 2 decimal places
 */
const formatAmount = (amount) => parseFloat(parseFloat(amount).toFixed(2));

/**
 * Generate a unique reference ID
 */
const generateRefId = (prefix = 'TXN') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Paginate query helper
 */
const getPagination = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;
  return { limit: limitNum, offset, page: pageNum };
};

/**
 * Build pagination meta
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});

/**
 * Format phone number to E.164 format for India (+91XXXXXXXXXX)
 */
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return phone;
};

/**
 * Sanitize user object to remove sensitive fields
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  const { ...sanitized } = user;
  return sanitized;
};

/**
 * Generate Razorpay signature verification string
 */
const generateRazorpaySignature = (orderId, paymentId, secret) => {
  const text = `${orderId}|${paymentId}`;
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
};

/**
 * Calculate date range for reports
 */
const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(now.getDate() - 30);
  }

  return { startDate: start.toISOString(), endDate: now.toISOString() };
};

/**
 * Mask phone number for display
 */
const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return phone;
  return `****${phone.slice(-4)}`;
};

module.exports = {
  formatAmount,
  generateRefId,
  getPagination,
  buildPaginationMeta,
  formatPhoneNumber,
  sanitizeUser,
  generateRazorpaySignature,
  getDateRange,
  maskPhone,
};
