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

// Fallback prices used before the API responds or when the API is down.
// These ensure all calculators work immediately on load.
export const FALLBACK_PRICES = {
  bitcoin:  { usd: 97000,  usd_24h_change: null },
  ethereum: { usd: 2700,   usd_24h_change: null },
  solana:   { usd: 200,    usd_24h_change: null },
  dogecoin: { usd: 0.25,   usd_24h_change: null },
  ripple:   { usd: 2.50,   usd_24h_change: null },
};
