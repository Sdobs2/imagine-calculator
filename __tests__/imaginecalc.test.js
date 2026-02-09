import {
  calculateImagine,
  calculateTimeMachine,
  formatCryptoAmount,
  formatUSD,
} from '../src/utils/imaginecalc';

describe('calculateImagine', () => {
  test('basic: $1000 initial, no DCA, price doubles', () => {
    const r = calculateImagine(1000, 0, 50000, 100000, 1);
    expect(r.totalInvested).toBe(1000);
    expect(r.totalCoins).toBeCloseTo(0.02);
    expect(r.portfolioValue).toBeCloseTo(2000);
    expect(r.profit).toBeCloseTo(1000);
    expect(r.multiplier).toBeCloseTo(2);
  });

  test('DCA only: $0 initial, $100/mo for 12 months', () => {
    const r = calculateImagine(0, 100, 50000, 100000, 12);
    expect(r.totalInvested).toBe(1200);
    expect(r.totalCoins).toBeCloseTo(0.024);
    expect(r.portfolioValue).toBeCloseTo(2400);
    expect(r.profit).toBeCloseTo(1200);
    expect(r.multiplier).toBeCloseTo(2);
  });

  test('combined initial + DCA', () => {
    const r = calculateImagine(5000, 500, 100000, 200000, 6);
    expect(r.totalInvested).toBe(8000);
    expect(r.totalCoins).toBeCloseTo(0.08);
    expect(r.portfolioValue).toBeCloseTo(16000);
    expect(r.profit).toBeCloseTo(8000);
    expect(r.multiplier).toBeCloseTo(2);
  });

  test('returns null for zero current price', () => {
    expect(calculateImagine(1000, 100, 0, 50000, 12)).toBeNull();
  });

  test('returns null for negative current price', () => {
    expect(calculateImagine(1000, 100, -1, 50000, 12)).toBeNull();
  });

  test('returns null for zero months', () => {
    expect(calculateImagine(1000, 100, 50000, 100000, 0)).toBeNull();
  });

  test('loss scenario: target < current', () => {
    const r = calculateImagine(1000, 0, 50000, 25000, 1);
    expect(r.profit).toBeCloseTo(-500);
    expect(r.multiplier).toBeCloseTo(0.5);
  });

  test('small prices like DOGE', () => {
    const r = calculateImagine(100, 0, 0.3, 1.0, 1);
    expect(r.totalCoins).toBeCloseTo(333.333, 2);
    expect(r.portfolioValue).toBeCloseTo(333.333, 2);
  });

  test('zero initial with DCA only', () => {
    const r = calculateImagine(0, 200, 40000, 80000, 6);
    expect(r.totalInvested).toBe(1200);
    expect(r.totalCoins).toBeCloseTo(0.03);
    expect(r.portfolioValue).toBeCloseTo(2400);
  });
});

describe('calculateTimeMachine', () => {
  test('basic: $1000 at $10, now $100', () => {
    const r = calculateTimeMachine(1000, 10, 100);
    expect(r.shares).toBe(100);
    expect(r.currentValue).toBe(10000);
    expect(r.profit).toBe(9000);
    expect(r.multiplier).toBe(10);
  });

  test('returns null for zero historical price', () => {
    expect(calculateTimeMachine(1000, 0, 100)).toBeNull();
  });

  test('returns null for negative historical price', () => {
    expect(calculateTimeMachine(1000, -5, 100)).toBeNull();
  });

  test('returns null for zero current price', () => {
    expect(calculateTimeMachine(1000, 10, 0)).toBeNull();
  });

  test('loss scenario', () => {
    const r = calculateTimeMachine(1000, 100, 50);
    expect(r.shares).toBe(10);
    expect(r.currentValue).toBe(500);
    expect(r.profit).toBe(-500);
    expect(r.multiplier).toBe(0.5);
  });

  test('fractional shares for expensive stocks', () => {
    const r = calculateTimeMachine(500, 3000, 6000);
    expect(r.shares).toBeCloseTo(0.1667, 3);
    expect(r.currentValue).toBeCloseTo(1000, 0);
    expect(r.multiplier).toBeCloseTo(2, 0);
  });
});

describe('formatCryptoAmount', () => {
  test('formats amounts >= 1 with up to 4 decimals', () => {
    const result = formatCryptoAmount(1.5);
    expect(result).toContain('1.5');
  });

  test('formats small amounts with up to 8 decimals', () => {
    const result = formatCryptoAmount(0.00042);
    expect(result).toContain('00042');
  });

  test('formats zero', () => {
    expect(formatCryptoAmount(0)).toContain('0');
  });
});

describe('formatUSD', () => {
  test('formats with 2 decimal places', () => {
    expect(formatUSD(1234.5)).toMatch(/1.*234.*50/);
  });

  test('formats zero', () => {
    expect(formatUSD(0)).toContain('0.00');
  });
});
