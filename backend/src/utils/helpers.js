'use strict';

/**
 * Build a paginated response object.
 * Supports both cursor-based and offset-based pagination.
 */
const paginate = ({
  data,
  total,
  limit,
  offset,
  nextCursor,
  prevCursor,
}) => ({
  data,
  pagination: {
    total,
    limit,
    offset,
    hasMore: nextCursor !== undefined ? !!nextCursor : offset + data.length < total,
    nextCursor: nextCursor || null,
    prevCursor: prevCursor || null,
  },
});

/**
 * Convert a numeric amount (paise) to a formatted rupee string.
 */
const formatCurrency = (paise) => {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(rupees);
};

/**
 * Sanitize a phone number to E.164 format (India assumed when no country code).
 */
const sanitizePhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('+')) return phone.replace(/[^\d+]/g, '');
  return `+${digits}`;
};

/**
 * Generate a unique order ID for Razorpay receipts.
 */
const generateReceiptId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `RCT-${ts}-${rand}`;
};

/**
 * Parse a boolean from a string env var or query param.
 */
const parseBool = (val, defaultVal = false) => {
  if (val === undefined || val === null) return defaultVal;
  if (typeof val === 'boolean') return val;
  return ['true', '1', 'yes'].includes(String(val).toLowerCase());
};

/**
 * Safely parse an integer with a fallback.
 */
const safeInt = (val, fallback = 0) => {
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? fallback : n;
};

module.exports = {
  paginate,
  formatCurrency,
  sanitizePhone,
  generateReceiptId,
  parseBool,
  safeInt,
};
