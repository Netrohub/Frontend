import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency with 2 decimal places by default', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(100.5)).toBe('$100.50');
      expect(formatCurrency(100.99)).toBe('$100.99');
    });

    it('should format large numbers with thousands separators', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(10000)).toBe('$10,000.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should handle zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
      expect(formatCurrency(-1000.50)).toBe('-$1,000.50');
    });

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(100.999)).toBe('$101.00');
      expect(formatCurrency(100.001)).toBe('$100.00');
      expect(formatCurrency(100.995)).toBe('$101.00');
    });
  });
});

