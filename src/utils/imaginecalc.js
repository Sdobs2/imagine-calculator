/**
 * Calculate a forward-looking "Imagine If" DCA scenario.
 * Assumes all monthly purchases happen at today's spot price.
 */
export function calculateImagine(
  initialInvestment,
  monthlyDCA,
  currentPrice,
  targetPrice,
  months,
) {
  if (currentPrice <= 0 || months <= 0) return null;

  const initialCoins = initialInvestment / currentPrice;
  const dcaCoins = (monthlyDCA * months) / currentPrice;
  const totalCoins = initialCoins + dcaCoins;
  const totalInvested = initialInvestment + monthlyDCA * months;
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
