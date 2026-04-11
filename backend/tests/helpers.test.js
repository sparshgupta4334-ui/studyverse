const { formatAmount, generateRefId, getPagination, buildPaginationMeta, formatPhoneNumber, getDateRange, maskPhone } = require('../src/utils/helpers');

describe('Helpers - formatAmount', () => {
  it('should format to 2 decimal places', () => {
    expect(formatAmount(100.5)).toBe(100.5);
    expect(formatAmount(100.556)).toBe(100.56);
    expect(formatAmount(100)).toBe(100);
  });
});

describe('Helpers - generateRefId', () => {
  it('should generate a unique reference ID with prefix', () => {
    const id = generateRefId('TXN');
    expect(id).toMatch(/^TXN_/);
  });

  it('should generate different IDs each time', () => {
    const id1 = generateRefId();
    const id2 = generateRefId();
    expect(id1).not.toBe(id2);
  });
});

describe('Helpers - getPagination', () => {
  it('should return correct pagination values', () => {
    const { limit, offset, page } = getPagination(2, 10);
    expect(page).toBe(2);
    expect(limit).toBe(10);
    expect(offset).toBe(10);
  });

  it('should default to page 1 with limit 20', () => {
    const { limit, offset, page } = getPagination();
    expect(page).toBe(1);
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });

  it('should cap limit at 100', () => {
    const { limit } = getPagination(1, 200);
    expect(limit).toBe(100);
  });

  it('should not allow page less than 1', () => {
    const { page } = getPagination(-1, 10);
    expect(page).toBe(1);
  });
});

describe('Helpers - buildPaginationMeta', () => {
  it('should correctly build pagination meta', () => {
    const meta = buildPaginationMeta(100, 2, 10);
    expect(meta.total).toBe(100);
    expect(meta.page).toBe(2);
    expect(meta.totalPages).toBe(10);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPrevPage).toBe(true);
  });

  it('should indicate no next page on last page', () => {
    const meta = buildPaginationMeta(10, 1, 10);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPrevPage).toBe(false);
  });
});

describe('Helpers - formatPhoneNumber', () => {
  it('should format 10 digit number to E.164', () => {
    expect(formatPhoneNumber('9876543210')).toBe('+919876543210');
  });

  it('should not modify already formatted number', () => {
    expect(formatPhoneNumber('+919876543210')).toBe('+919876543210');
  });

  it('should handle 91 prefix', () => {
    expect(formatPhoneNumber('919876543210')).toBe('+919876543210');
  });
});

describe('Helpers - maskPhone', () => {
  it('should mask all but last 4 digits', () => {
    expect(maskPhone('9876543210')).toBe('****3210');
  });

  it('should handle null input', () => {
    expect(maskPhone(null)).toBeNull();
  });
});

describe('Helpers - getDateRange', () => {
  it('should return date range for "today"', () => {
    const range = getDateRange('today');
    expect(range.startDate).toBeDefined();
    expect(range.endDate).toBeDefined();
    expect(new Date(range.startDate) <= new Date(range.endDate)).toBe(true);
  });

  it('should return date range for "week"', () => {
    const range = getDateRange('week');
    const diffDays = (new Date(range.endDate) - new Date(range.startDate)) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThanOrEqual(6);
    expect(diffDays).toBeLessThanOrEqual(8);
  });
});
