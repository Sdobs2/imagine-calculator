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
export const PRICE_REFRESH_MS = 60000;
