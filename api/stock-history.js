/**
 * Vercel Serverless Function: Stock Historical Price Proxy
 *
 * GET /api/stock-history?symbol=TSLA&year=2015
 * Returns: { symbol, year, high, low, close, currentPrice }
 *
 * Uses Alpha Vantage TIME_SERIES_MONTHLY endpoint (free, no credit card).
 * Results are cached aggressively since historical data doesn't change.
 */

const ALLOWED_SYMBOLS = [
  'TSLA', 'AAPL', 'AMZN', 'GOOG', 'NVDA',
  'META', 'MSFT', 'NFLX', 'BRK.B', 'JPM',
];

export default async function handler(req, res) {
  const { symbol, year } = req.query;

  // Validate inputs
  if (!symbol || !year) {
    return res.status(400).json({ error: 'Missing symbol or year parameter' });
  }

  if (!ALLOWED_SYMBOLS.includes(symbol.toUpperCase())) {
    return res.status(400).json({ error: `Symbol not supported. Allowed: ${ALLOWED_SYMBOLS.join(', ')}` });
  }

  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear()) {
    return res.status(400).json({ error: 'Year must be between 2000 and current year' });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Use Alpha Vantage monthly data
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Error Message'] || data['Note']) {
      return res.status(429).json({
        error: data['Note'] || data['Error Message'] || 'API limit reached',
      });
    }

    const monthly = data['Monthly Time Series'];
    if (!monthly) {
      return res.status(404).json({ error: 'No data found for this symbol' });
    }

    // Filter entries for the requested year
    const yearEntries = Object.entries(monthly).filter(([date]) =>
      date.startsWith(`${yearNum}-`),
    );

    if (yearEntries.length === 0) {
      return res.status(404).json({ error: `No data for ${symbol} in ${yearNum}` });
    }

    // Calculate year stats
    let high = -Infinity;
    let low = Infinity;
    let close = 0;

    for (const [, values] of yearEntries) {
      const h = parseFloat(values['2. high']);
      const l = parseFloat(values['3. low']);
      if (h > high) high = h;
      if (l < low) low = l;
    }

    // Close of last month of the year
    const lastEntry = yearEntries[0]; // sorted desc by date
    close = parseFloat(lastEntry[1]['4. close']);

    // Get most recent close as "current price"
    const allDates = Object.keys(monthly);
    const latestClose = parseFloat(monthly[allDates[0]]['4. close']);

    // Cache for 24 hours — historical data doesn't change
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

    return res.status(200).json({
      symbol: symbol.toUpperCase(),
      year: yearNum,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      currentPrice: Math.round(latestClose * 100) / 100,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
