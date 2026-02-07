import { calculate } from '../src/utils/calculate';

// ---------------------------------------------------------------------------
// calculate('whatIs', a, b) — "What is X% of Y?"
// (aliased as 'percentOf' in spec — maps to 'whatIs' in code)
// ---------------------------------------------------------------------------

describe('calculate — whatIs (percentOf)', () => {
  test('10% of 200 = 20', () => {
    expect(calculate('whatIs', '10', '200')).toBe(20);
  });

  test('50% of 80 = 40', () => {
    expect(calculate('whatIs', '50', '80')).toBe(40);
  });

  test('100% of 250 = 250', () => {
    expect(calculate('whatIs', '100', '250')).toBe(250);
  });

  test('0% of any number = 0', () => {
    expect(calculate('whatIs', '0', '500')).toBe(0);
  });

  test('X% of 0 = 0', () => {
    expect(calculate('whatIs', '25', '0')).toBe(0);
  });

  test('0% of 0 = 0', () => {
    expect(calculate('whatIs', '0', '0')).toBe(0);
  });

  test('large numbers: 15% of 1000000', () => {
    expect(calculate('whatIs', '15', '1000000')).toBe(150000);
  });

  test('decimal inputs: 7.5% of 200 = 15', () => {
    expect(calculate('whatIs', '7.5', '200')).toBe(15);
  });

  test('decimal result: 33% of 100 = 33', () => {
    expect(calculate('whatIs', '33', '100')).toBe(33);
  });

  test('small decimals: 0.1% of 1000 = 1', () => {
    expect(calculate('whatIs', '0.1', '1000')).toBe(1);
  });

  test('returns null for non-numeric a', () => {
    expect(calculate('whatIs', 'abc', '100')).toBeNull();
  });

  test('returns null for non-numeric b', () => {
    expect(calculate('whatIs', '10', 'xyz')).toBeNull();
  });

  test('returns null for empty strings', () => {
    expect(calculate('whatIs', '', '')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// calculate('whatPercent', a, b) — "X is what % of Y?"
// ---------------------------------------------------------------------------

describe('calculate — whatPercent', () => {
  test('50 is 50% of 100', () => {
    expect(calculate('whatPercent', '50', '100')).toBe(50);
  });

  test('25 is 100% of 25', () => {
    expect(calculate('whatPercent', '25', '25')).toBe(100);
  });

  test('1 is 10% of 10', () => {
    expect(calculate('whatPercent', '1', '10')).toBe(10);
  });

  test('0 is 0% of anything', () => {
    expect(calculate('whatPercent', '0', '500')).toBe(0);
  });

  test('200 is 200% of 100', () => {
    expect(calculate('whatPercent', '200', '100')).toBe(200);
  });

  test('decimal: 3.5 of 7 = 50%', () => {
    expect(calculate('whatPercent', '3.5', '7')).toBe(50);
  });

  test('large numbers: 500000 of 1000000 = 50%', () => {
    expect(calculate('whatPercent', '500000', '1000000')).toBe(50);
  });

  test('division by zero (b=0) returns null', () => {
    expect(calculate('whatPercent', '10', '0')).toBeNull();
  });

  test('returns null for non-numeric input', () => {
    expect(calculate('whatPercent', 'abc', '100')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// calculate('change', a, b) — "% Change from X to Y"
// ---------------------------------------------------------------------------

describe('calculate — change', () => {
  test('positive change: 100 to 150 = 50%', () => {
    expect(calculate('change', '100', '150')).toBe(50);
  });

  test('negative change: 200 to 150 = -25%', () => {
    expect(calculate('change', '200', '150')).toBe(-25);
  });

  test('no change: 100 to 100 = 0%', () => {
    expect(calculate('change', '100', '100')).toBe(0);
  });

  test('doubling: 50 to 100 = 100%', () => {
    expect(calculate('change', '50', '100')).toBe(100);
  });

  test('halving: 100 to 50 = -50%', () => {
    expect(calculate('change', '100', '50')).toBe(-50);
  });

  test('large positive change: 1 to 1000 = 99900%', () => {
    expect(calculate('change', '1', '1000')).toBe(99900);
  });

  test('decimal values: 2.5 to 5 = 100%', () => {
    expect(calculate('change', '2.5', '5')).toBe(100);
  });

  test('division by zero (a=0) returns null', () => {
    expect(calculate('change', '0', '100')).toBeNull();
  });

  test('negative from value: -100 to -50 = 50%', () => {
    expect(calculate('change', '-100', '-50')).toBe(50);
  });

  test('negative to positive: -100 to 100 = 200%', () => {
    expect(calculate('change', '-100', '100')).toBe(200);
  });

  test('returns null for non-numeric input', () => {
    expect(calculate('change', 'foo', '100')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Unknown type
// ---------------------------------------------------------------------------

describe('calculate — unknown type', () => {
  test('returns null for unknown calculation type', () => {
    expect(calculate('unknown', '10', '20')).toBeNull();
  });
});
