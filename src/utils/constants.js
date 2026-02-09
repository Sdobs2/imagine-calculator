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

// Historical Jan-1 prices (USD) for Time Machine calculator.
// Hardcoded because CoinGecko's free API restricts historical data to 365 days.
// Sources: CoinGecko, CoinMarketCap historical snapshots.
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

// Fallback prices used before the API responds or when the API is down.
// These ensure all calculators work immediately on load.
export const FALLBACK_PRICES = {
  bitcoin:  { usd: 97000,  usd_24h_change: null },
  ethereum: { usd: 2700,   usd_24h_change: null },
  solana:   { usd: 200,    usd_24h_change: null },
  dogecoin: { usd: 0.25,   usd_24h_change: null },
  ripple:   { usd: 2.50,   usd_24h_change: null },
};
