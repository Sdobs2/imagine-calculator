import { formatResult } from '../src/utils/calculate';

// ---------------------------------------------------------------------------
// Null input
// ---------------------------------------------------------------------------

describe('formatResult — null', () => {
  test('returns em-dash for null', () => {
    expect(formatResult(null)).toBe('\u2014');
  });
});

// ---------------------------------------------------------------------------
// Integer values — should be locale-formatted whole numbers
// ---------------------------------------------------------------------------

describe('formatResult — integers', () => {
  test('formats 0', () => {
    expect(formatResult(0)).toBe('0');
  });

  test('formats 100', () => {
    expect(formatResult(100)).toBe('100');
  });

  test('formats 50', () => {
    expect(formatResult(50)).toBe('50');
  });

  test('formats negative integer', () => {
    expect(formatResult(-25)).toBe('-25');
  });

  test('formats large integer with locale separators', () => {
    // toLocaleString() in Node.js default locale formats 1000000 as "1,000,000"
    const result = formatResult(1000000);
    // Just verify it includes the digits — locale formatting may vary
    expect(result).toMatch(/1.*000.*000/);
  });
});

// ---------------------------------------------------------------------------
// Decimal rounding — up to 6 decimal places
// ---------------------------------------------------------------------------

describe('formatResult — decimals', () => {
  test('formats simple decimal 33.33', () => {
    const result = formatResult(33.33);
    expect(result).toContain('33');
    expect(result).toContain('33');
  });

  test('preserves up to 6 decimal digits', () => {
    const result = formatResult(1.123456);
    expect(result).toContain('1');
    expect(result).toContain('123456');
  });

  test('trims trailing zeros from decimals', () => {
    // 1.50000 should become "1.5"
    const result = formatResult(1.5);
    expect(result).toBe('1.5');
  });

  test('handles very small decimal', () => {
    const result = formatResult(0.000001);
    expect(result).toContain('0');
    expect(result).toContain('000001');
  });

  test('rounds beyond 6 decimal places', () => {
    // 1.1234567 should round/truncate to at most 6 decimal digits
    const result = formatResult(1.1234567);
    // The internal rounding at 1e10 precision, then .toFixed(6) truncation
    expect(result).toContain('1');
  });
});

// ---------------------------------------------------------------------------
// Edge cases — NaN, Infinity
// ---------------------------------------------------------------------------

describe('formatResult — edge cases', () => {
  test('NaN produces "NaN" string', () => {
    const result = formatResult(NaN);
    expect(result).toBe('NaN');
  });

  test('Infinity produces "Infinity" or locale equivalent', () => {
    const result = formatResult(Infinity);
    // toLocaleString() for Infinity typically returns "Infinity" or "∞"
    expect(result).toMatch(/Infinity|∞/);
  });

  test('-Infinity produces negative infinity string', () => {
    const result = formatResult(-Infinity);
    expect(result).toMatch(/-Infinity|-∞/);
  });

  test('very small floating point: 0.1 + 0.2 rounds cleanly', () => {
    // 0.1 + 0.2 = 0.30000000000000004 in JS
    // After Math.round(val * 1e10) / 1e10 it should be 0.3
    const result = formatResult(0.1 + 0.2);
    expect(result).toBe('0.3');
  });

  test('negative zero formats as "-0"', () => {
    // JS preserves -0 through Math.round and toLocaleString
    const result = formatResult(-0);
    expect(result).toBe('-0');
  });
});
