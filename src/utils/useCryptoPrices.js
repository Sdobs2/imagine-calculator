import { useState, useEffect, useCallback, useRef } from 'react';
import { COINGECKO_URL, COINGECKO_DEMO_KEY, SUPPORTED_CRYPTOS, PRICE_REFRESH_MS } from './constants';

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
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(URL, {
        headers: { 'x-cg-demo-api-key': COINGECKO_DEMO_KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(friendlyError(err));
      // Keep stale prices — don't clear on refresh failure
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
