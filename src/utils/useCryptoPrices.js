import { useState, useEffect, useCallback, useRef } from 'react';
import { COINGECKO_URL, SUPPORTED_CRYPTOS, PRICE_REFRESH_MS } from './constants';

const IDS = SUPPORTED_CRYPTOS.map((c) => c.id).join(',');
const URL = `${COINGECKO_URL}?ids=${IDS}&vs_currencies=usd&include_24hr_change=true`;

export function useCryptoPrices() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
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
