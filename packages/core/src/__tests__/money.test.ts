import { describe, it, expect } from 'vitest';
import {
  addMoney,
  subtractMoney,
  multiplyMoney,
  percentageOf,
  formatMoney,
  toCents,
  toDollars,
  clampMoney,
  sumMoney,
} from '../utils/money.js';

describe('money utilities', () => {
  it('adds money correctly', () => {
    expect(addMoney(1000, 500)).toBe(1500);
    expect(addMoney(0, 0)).toBe(0);
  });

  it('subtracts money correctly', () => {
    expect(subtractMoney(1000, 300)).toBe(700);
    expect(subtractMoney(100, 200)).toBe(-100);
  });

  it('multiplies money by quantity', () => {
    expect(multiplyMoney(1999, 3)).toBe(5997);
    expect(multiplyMoney(1050, 1.5)).toBe(1575);
  });

  it('calculates percentage correctly', () => {
    expect(percentageOf(10000, 10)).toBe(1000); // 10% of $100
    expect(percentageOf(1999, 15)).toBe(300); // 15% of $19.99 = ~$3.00
    expect(percentageOf(0, 50)).toBe(0);
  });

  it('formats money as currency string', () => {
    expect(formatMoney(1999)).toBe('$19.99');
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(100)).toBe('$1.00');
    expect(formatMoney(50)).toBe('$0.50');
  });

  it('converts between dollars and cents', () => {
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(0)).toBe(0);
    expect(toDollars(1999)).toBe(19.99);
    expect(toDollars(0)).toBe(0);
  });

  it('clamps money to non-negative', () => {
    expect(clampMoney(-500)).toBe(0);
    expect(clampMoney(0)).toBe(0);
    expect(clampMoney(1000)).toBe(1000);
  });

  it('sums array of money values', () => {
    expect(sumMoney([100, 200, 300])).toBe(600);
    expect(sumMoney([])).toBe(0);
    expect(sumMoney([1999])).toBe(1999);
  });
});
