import { useState, useEffect, useCallback, useRef } from 'react';
import {
  COINGECKO_URL,
  COINGECKO_DEMO_KEY,
  SUPPORTED_CRYPTOS,
  PRICE_REFRESH_MS,
  FALLBACK_PRICES,
} from './constants';

const IDS = SUPPORTED_CRYPTOS.map((c) => c.id).join(',');
const URL = `${COINGECKO_URL}?ids=${IDS}&vs_currencies=usd&include_24hr_change=true`;

function friendlyError(err) {
  const msg = err.message || '';
  if (msg.includes('429') || msg.includes('rate')) return 'Rate limited by CoinGecko. Prices will refresh shortly.';
  if (msg.includes('403')) return 'CoinGecko access denied. Prices will refresh shortly.';
  if (msg.includes('Load failed') || msg.includes('fetch') || msg.includes('network')) return 'Network error. Check your connection.';
  return 'Unable to load prices. Please try again.';
}

export function useCryptoPrices() {
  // Start with fallback prices so calculators work immediately
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchPrices = useCallback(async () => {
    try {
      // Build headers — only include the demo key if a real one is configured
      const headers = {};
      if (COINGECKO_DEMO_KEY && COINGECKO_DEMO_KEY !== 'CG-DEMO') {
        headers['x-cg-demo-api-key'] = COINGECKO_DEMO_KEY;
      }

      const res = await fetch(URL, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(friendlyError(err));
      // Keep existing prices (fallback or last successful fetch)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, PRICE_REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchPrices]);

  return { prices, loading, error, lastUpdated, refresh: fetchPrices };
}
