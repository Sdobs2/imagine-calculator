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
