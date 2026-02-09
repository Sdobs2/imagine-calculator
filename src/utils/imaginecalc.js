/**
 * DCA price models:
 *   'bestCase'  — all purchases at today's price (original, most optimistic)
 *   'linear'    — price interpolates linearly from current to target each month
 *   'volatile'  — linear trend + realistic monthly volatility noise
 */

// ─── Seeded PRNG (mulberry32) for deterministic volatile results ────────────

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(init, monthly, current, target, months) {
  // Simple hash from inputs for deterministic randomness
  return Math.round((init * 7 + monthly * 13 + current * 31 + target * 37 + months * 41) * 100);
}

// Box-Muller transform for normally distributed noise
function gaussianRandom(rng) {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Calculate a forward-looking "Imagine If" DCA scenario.
 *
 * @param {'bestCase'|'linear'|'volatile'} model  Price model to use
 */
export function calculateImagine(
  initialInvestment,
  monthlyDCA,
  currentPrice,
  targetPrice,
  months,
  model = 'bestCase',
) {
  if (currentPrice <= 0 || months <= 0) return null;

  const totalInvested = initialInvestment + monthlyDCA * months;

  if (model === 'bestCase') {
    // Original: all purchases at today's price
    const initialCoins = initialInvestment / currentPrice;
    const dcaCoins = (monthlyDCA * months) / currentPrice;
    const totalCoins = initialCoins + dcaCoins;
    const portfolioValue = totalCoins * targetPrice;
    const profit = portfolioValue - totalInvested;
    const multiplier = totalInvested > 0 ? portfolioValue / totalInvested : 0;
    return { totalInvested, totalCoins, portfolioValue, profit, multiplier };
  }

  // For linear and volatile: month-by-month accumulation
  const rng = model === 'volatile'
    ? mulberry32(hashSeed(initialInvestment, monthlyDCA, currentPrice, targetPrice, months))
    : null;

  // Monthly volatility — ~15% standard deviation (typical crypto)
  const MONTHLY_VOL = 0.15;

  let totalCoins = initialInvestment / currentPrice; // initial buy at today's price

  for (let m = 1; m <= months; m++) {
    // Linear interpolated price at month m
    let priceAtMonth = currentPrice + (targetPrice - currentPrice) * (m / months);

    if (model === 'volatile' && rng) {
      // Add noise: price * (1 + vol * gaussian), clamped to stay positive
      const noise = MONTHLY_VOL * gaussianRandom(rng);
      priceAtMonth = priceAtMonth * (1 + noise);
      priceAtMonth = Math.max(priceAtMonth, currentPrice * 0.01); // floor at 1% of current
    }

    if (priceAtMonth > 0 && monthlyDCA > 0) {
      totalCoins += monthlyDCA / priceAtMonth;
    }
  }

  const portfolioValue = totalCoins * targetPrice;
  const profit = portfolioValue - totalInvested;
  const multiplier = totalInvested > 0 ? portfolioValue / totalInvested : 0;

  return { totalInvested, totalCoins, portfolioValue, profit, multiplier };
}

/**
 * Calculate a backward-looking "What if I invested in X in year Y" scenario.
 */
export function calculateTimeMachine(
  investedAmount,
  historicalPrice,
  currentPrice,
) {
  if (historicalPrice <= 0 || currentPrice <= 0) return null;

  const shares = investedAmount / historicalPrice;
  const currentValue = shares * currentPrice;
  const profit = currentValue - investedAmount;
  const multiplier = investedAmount > 0 ? currentValue / investedAmount : 0;

  return { shares, currentValue, profit, multiplier };
}

/**
 * Calculate compound growth with optional monthly contributions.
 * Uses month-by-month accumulation for accurate exponential curves.
 *
 * @param {number} initialInvestment  Lump-sum starting amount
 * @param {number} monthlyContribution  Amount added each month
 * @param {number} annualReturn  Annual return as a decimal (0.10 = 10%)
 * @param {number} years  Time horizon in years
 */
export function calculateCompoundGrowth(
  initialInvestment,
  monthlyContribution,
  annualReturn,
  years,
) {
  if (years <= 0) return null;

  const totalMonths = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;

  let balance = initialInvestment;
  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }

  const totalContributed = initialInvestment + monthlyContribution * totalMonths;
  const interestEarned = balance - totalContributed;
  const multiplier = totalContributed > 0 ? balance / totalContributed : 0;

  return { finalValue: balance, totalContributed, interestEarned, multiplier };
}

/**
 * Generate chart data points for compound growth visualization.
 * Returns an array of { month, value, invested } compatible with GrowthChart.
 */
export function generateCompoundChartData(
  initialInvestment,
  monthlyContribution,
  annualReturn,
  years,
) {
  if (years <= 0) return [];

  const totalMonths = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + annualReturn, 1 / 12) - 1;

  // Sample up to 48 points for smooth exponential curves
  const numPoints = Math.min(Math.max(totalMonths + 1, 3), 49);
  const step = totalMonths / (numPoints - 1);
  const data = [];

  let balance = initialInvestment;
  let lastComputedMonth = 0;

  for (let i = 0; i < numPoints; i++) {
    const targetMonth = Math.min(Math.round(i * step), totalMonths);

    // Advance the simulation from lastComputedMonth to targetMonth
    for (let m = lastComputedMonth + 1; m <= targetMonth; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    lastComputedMonth = targetMonth;

    const totalInvested = initialInvestment + monthlyContribution * targetMonth;
    data.push({ month: targetMonth, value: balance, invested: totalInvested });
  }

  return data;
}

/**
 * Format a crypto amount with appropriate decimal places.
 */
export function formatCryptoAmount(amount) {
  if (amount >= 1) {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

/**
 * Format a USD amount.
 */
export function formatUSD(amount) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
