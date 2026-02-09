import { Platform } from 'react-native';

export const calculators = [
  { id: 'whatIs' },
  { id: 'whatPercent' },
  { id: 'change' },
];

export const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
export const SANS = Platform.select({ ios: 'System', default: 'sans-serif' });

export const SUPPORTED_CRYPTOS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
];

export const SUPPORTED_STOCKS = [
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'GOOG', name: 'Alphabet' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'NFLX', name: 'Netflix' },
  { symbol: 'BRK.B', name: 'Berkshire' },
  { symbol: 'JPM', name: 'JPMorgan' },
];

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';
export const COINGECKO_DEMO_KEY = ''; // Leave empty for free tier; set a real key for higher rate limits
export const PRICE_REFRESH_MS = 60000;

// Historical Jan-1 (Year Open) prices (USD) for Time Machine calculator.
// All values are split-adjusted to today's share count.
// Sources: MacroTrends, CoinGecko, CoinMarketCap historical snapshots.

export const STOCK_HISTORICAL_PRICES = {
  TSLA: {
    2010: 1.13, 2011: 1.77, 2012: 1.87, 2013: 2.36, 2014: 10.01,
    2015: 14.62, 2016: 14.89, 2017: 14.47, 2018: 21.37, 2019: 20.67,
    2020: 28.68, 2021: 243.00, 2022: 400.00, 2023: 123.18, 2024: 248.42, 2025: 378.55,
  },
  AAPL: {
    2005: 0.95, 2006: 2.24, 2007: 2.51, 2008: 5.84, 2009: 2.72,
    2010: 6.42, 2011: 9.88, 2012: 12.33, 2013: 16.61, 2014: 17.16,
    2015: 24.24, 2016: 23.75, 2017: 26.77, 2018: 40.34, 2019: 37.54,
    2020: 72.47, 2021: 125.98, 2022: 178.27, 2023: 123.21, 2024: 183.90, 2025: 242.75,
  },
  AMZN: {
    2005: 2.23, 2006: 2.38, 2007: 1.94, 2008: 4.81, 2009: 2.72,
    2010: 6.70, 2011: 9.21, 2012: 8.95, 2013: 12.87, 2014: 19.90,
    2015: 15.43, 2016: 31.85, 2017: 37.68, 2018: 59.45, 2019: 76.96,
    2020: 94.90, 2021: 159.33, 2022: 170.41, 2023: 85.82, 2024: 149.93, 2025: 220.22,
  },
  GOOG: {
    2005: 5.01, 2006: 10.76, 2007: 11.56, 2008: 16.94, 2009: 7.94,
    2010: 15.49, 2011: 14.94, 2012: 16.45, 2013: 17.88, 2014: 27.52,
    2015: 25.97, 2016: 36.82, 2017: 39.01, 2018: 52.85, 2019: 51.90,
    2020: 67.86, 2021: 85.77, 2022: 143.99, 2023: 89.03, 2024: 138.52, 2025: 189.89,
  },
  NVDA: {
    2005: 0.18, 2006: 0.29, 2007: 0.55, 2008: 0.76, 2009: 0.20,
    2010: 0.42, 2011: 0.36, 2012: 0.32, 2013: 0.29, 2014: 0.37,
    2015: 0.48, 2016: 0.79, 2017: 2.51, 2018: 4.93, 2019: 3.38,
    2020: 5.97, 2021: 13.08, 2022: 30.06, 2023: 14.30, 2024: 48.14, 2025: 138.27,
  },
  META: {
    2012: 38.23, 2013: 27.81, 2014: 54.33, 2015: 77.91, 2016: 101.51,
    2017: 116.05, 2018: 180.16, 2019: 134.74, 2020: 208.33, 2021: 267.07,
    2022: 336.19, 2023: 123.88, 2024: 343.89, 2025: 597.36,
  },
  MSFT: {
    2005: 18.40, 2006: 18.70, 2007: 21.10, 2008: 25.23, 2009: 14.83,
    2010: 23.11, 2011: 21.33, 2012: 20.94, 2013: 22.22, 2014: 30.80,
    2015: 39.81, 2016: 47.93, 2017: 56.23, 2018: 78.96, 2019: 94.50,
    2020: 152.51, 2021: 208.88, 2022: 323.90, 2023: 233.99, 2024: 365.42, 2025: 415.52,
  },
  NFLX: {
    2005: 0.17, 2006: 0.37, 2007: 0.38, 2008: 0.38, 2009: 0.43,
    2010: 0.76, 2011: 2.55, 2012: 1.03, 2013: 1.31, 2014: 5.18,
    2015: 4.98, 2016: 11.00, 2017: 12.75, 2018: 20.11, 2019: 26.77,
    2020: 32.98, 2021: 52.29, 2022: 59.74, 2023: 29.50, 2024: 46.85, 2025: 88.67,
  },
  'BRK.B': {
    2005: 57.98, 2006: 59.30, 2007: 72.86, 2008: 92.10, 2009: 66.46,
    2010: 66.22, 2011: 80.41, 2012: 77.68, 2013: 93.20, 2014: 117.50,
    2015: 149.17, 2016: 130.75, 2017: 163.83, 2018: 197.22, 2019: 202.80,
    2020: 228.39, 2021: 228.45, 2022: 300.79, 2023: 309.91, 2024: 362.46, 2025: 451.10,
  },
  JPM: {
    2005: 22.27, 2006: 23.75, 2007: 29.54, 2008: 26.75, 2009: 20.68,
    2010: 28.42, 2011: 29.02, 2012: 23.80, 2013: 31.50, 2014: 42.20,
    2015: 46.51, 2016: 48.65, 2017: 68.21, 2018: 86.34, 2019: 81.25,
    2020: 119.04, 2021: 110.05, 2022: 144.93, 2023: 124.93, 2024: 163.84, 2025: 233.97,
  },
};

export const CRYPTO_HISTORICAL_PRICES = {
  bitcoin: {
    2011: 0.30, 2012: 5.27, 2013: 13.30, 2014: 770, 2015: 314,
    2016: 434, 2017: 998, 2018: 13412, 2019: 3693, 2020: 7200,
    2021: 29022, 2022: 46306, 2023: 16530, 2024: 44172, 2025: 93429,
  },
  ethereum: {
    2016: 0.93, 2017: 8.17, 2018: 755, 2019: 130, 2020: 130,
    2021: 737, 2022: 3683, 2023: 1196, 2024: 2352, 2025: 3350,
  },
  solana: {
    2021: 1.52, 2022: 170, 2023: 9.97, 2024: 101, 2025: 189,
  },
  dogecoin: {
    2014: 0.0003, 2015: 0.00018, 2016: 0.00014, 2017: 0.00022,
    2018: 0.0098, 2019: 0.0023, 2020: 0.0020, 2021: 0.0047,
    2022: 0.17, 2023: 0.070, 2024: 0.091, 2025: 0.315,
  },
  ripple: {
    2014: 0.035, 2015: 0.018, 2016: 0.006, 2017: 0.0063,
    2018: 2.30, 2019: 0.36, 2020: 0.19, 2021: 0.22,
    2022: 0.83, 2023: 0.34, 2024: 0.62, 2025: 2.10,
  },
};

// Approximate current stock prices (split-adjusted, as of Feb 2026).
// Used for Time Machine "Value Today" since we don't have a live stock API.
// Update these periodically for accuracy.
export const STOCK_CURRENT_PRICES = {
  TSLA: 380.00,
  AAPL: 276.15,
  AMZN: 222.69,
  GOOG: 200.00,
  NVDA: 138.27,
  META: 670.12,
  MSFT: 483.62,
  NFLX: 80.87,
  'BRK.B': 508.09,
  JPM: 320.77,
};

// Fallback prices used before the API responds or when the API is down.
// These ensure all calculators work immediately on load.
export const FALLBACK_PRICES = {
  bitcoin:  { usd: 97000,  usd_24h_change: null },
  ethereum: { usd: 2700,   usd_24h_change: null },
  solana:   { usd: 200,    usd_24h_change: null },
  dogecoin: { usd: 0.25,   usd_24h_change: null },
  ripple:   { usd: 2.50,   usd_24h_change: null },
};
