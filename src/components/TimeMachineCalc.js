import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import { SUPPORTED_STOCKS, SUPPORTED_CRYPTOS, COINGECKO_DEMO_KEY } from '../utils/constants';
import { calculateTimeMachine, formatUSD } from '../utils/imaginecalc';
import createStyles from '../styles';
import YearPicker from './YearPicker';

function getMultiplierLabel(m) {
  if (m <= 0) return '0x';
  if (Number.isInteger(m)) return `${m}x`;
  if (m >= 100) return `${Math.round(m)}x`;
  if (m >= 10) return `${Math.round(m * 10) / 10}x`;
  return `${Math.round(m * 100) / 100}x`;
}

const STOCK_ASSETS = SUPPORTED_STOCKS.map((s) => ({ ...s, type: 'stock' }));
const CRYPTO_ASSETS = SUPPORTED_CRYPTOS.map((c) => ({
  symbol: c.symbol,
  name: c.name,
  id: c.id,
  type: 'crypto',
}));
const ALL_ASSETS = [...STOCK_ASSETS, ...CRYPTO_ASSETS];

// Earliest year with reliable data for each asset
const ASSET_START_YEARS = {
  TSLA: 2010,
  AAPL: 2005,
  AMZN: 2005,
  GOOG: 2005,
  NVDA: 2005,
  META: 2012,
  MSFT: 2005,
  NFLX: 2005,
  'BRK.B': 2005,
  JPM: 2005,
  BTC: 2011,
  ETH: 2016,
  SOL: 2021,
  DOGE: 2014,
  XRP: 2014,
};

const ALL_YEARS = [];
for (let y = 2025; y >= 2005; y--) ALL_YEARS.push(y);

function TimeMachineCalc({ prices }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedAsset, setSelectedAsset] = useState('TSLA');
  const [selectedYear, setSelectedYear] = useState(2015);
  const [invested, setInvested] = useState('1000');
  const [focusedField, setFocusedField] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const asset = ALL_ASSETS.find((a) => a.symbol === selectedAsset);

  // Filter years based on selected asset
  const availableYears = useMemo(() => {
    const startYear = ASSET_START_YEARS[selectedAsset] || 2005;
    return ALL_YEARS.filter((y) => y >= startYear);
  }, [selectedAsset]);

  // Auto-adjust year when switching to an asset with a later start date
  useEffect(() => {
    const startYear = ASSET_START_YEARS[selectedAsset] || 2005;
    if (selectedYear < startYear) {
      setSelectedYear(startYear);
    }
  }, [selectedAsset]);

  // Fetch historical price when asset/year changes
  useEffect(() => {
    if (!asset) return;
    let cancelled = false;

    async function fetchHistory() {
      setHistLoading(true);
      setHistError(null);
      setHistoricalData(null);

      try {
        if (asset.type === 'stock') {
          const res = await fetch(
            `/api/stock-history?symbol=${asset.symbol}&year=${selectedYear}`,
          );
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            if (res.status === 500 && body.error?.includes('API key')) {
              throw new Error('Stock data is temporarily unavailable.');
            } else if (res.status === 429) {
              throw new Error('Too many requests. Please wait a moment.');
            } else if (res.status === 404) {
              throw new Error(`No data found for ${asset.symbol} in ${selectedYear}.`);
            } else {
              throw new Error(body.error || 'Unable to fetch stock data.');
            }
          }
          const data = await res.json();
          if (!cancelled) setHistoricalData(data);
        } else {
          // Crypto: use CoinGecko history
          const dateStr = `01-01-${selectedYear}`;
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${asset.id}/history?date=${dateStr}&localization=false`,
            { headers: { 'x-cg-demo-api-key': COINGECKO_DEMO_KEY } },
          );
          if (!res.ok) {
            if (res.status === 429) {
              throw new Error('Rate limited. Please wait a moment.');
            }
            throw new Error(`Unable to load ${asset.symbol} data for ${selectedYear}.`);
          }
          const data = await res.json();
          if (!cancelled && data.market_data) {
            setHistoricalData({
              symbol: asset.symbol,
              year: selectedYear,
              low: data.market_data.current_price.usd,
              high: data.market_data.current_price.usd,
              close: data.market_data.current_price.usd,
            });
          } else if (!cancelled) {
            throw new Error(`No data available for ${asset.symbol} in ${selectedYear}.`);
          }
        }
      } catch (err) {
        if (!cancelled) setHistError(err.message);
      } finally {
        if (!cancelled) setHistLoading(false);
      }
    }

    fetchHistory();
    return () => { cancelled = true; };
  }, [asset, selectedYear]);

  // Get current price
  const currentPrice = useMemo(() => {
    if (!asset) return 0;
    if (asset.type === 'crypto' && prices?.[asset.id]) {
      return prices[asset.id].usd;
    }
    // For stocks, use the latest close from historical data if available
    if (historicalData?.currentPrice) return historicalData.currentPrice;
    return 0;
  }, [asset, prices, historicalData]);

  const historicalPrice = historicalData?.low ?? 0;

  const result = useMemo(() => {
    const inv = parseFloat(invested);
    if (isNaN(inv) || inv <= 0 || historicalPrice <= 0 || currentPrice <= 0) return null;
    return calculateTimeMachine(inv, historicalPrice, currentPrice);
  }, [invested, historicalPrice, currentPrice]);

  const hasResult = result !== null;
  const isGain = hasResult && result.profit >= 0;

  const copyResult = useCallback(async () => {
    if (!result) return;
    const text = `What if: $${formatUSD(parseFloat(invested))} in ${asset.name} in ${selectedYear} at $${formatUSD(historicalPrice)} \u2192 $${formatUSD(result.currentValue)} today (${getMultiplierLabel(result.multiplier)}, ${result.profit >= 0 ? '+' : ''}$${formatUSD(Math.abs(result.profit))})`;
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [result, asset, invested, selectedYear, historicalPrice]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Time Machine</Text>

      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          What if you invested{' '}
          <Text style={styles.descHighlight}>${invested || '1,000'}</Text> in{' '}
          <Text style={styles.descHighlight}>{asset?.name || 'Tesla'}</Text> in{' '}
          <Text style={styles.descHighlight}>{selectedYear}</Text>?
        </Text>
      </View>

      {/* Stock selector */}
      <Text style={styles.sectionLabel}>Stocks</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        {STOCK_ASSETS.map((a) => {
          const isSelected = a.symbol === selectedAsset;
          return (
            <TouchableOpacity
              key={a.symbol}
              style={[styles.chip, isSelected && styles.chipSelected, { marginRight: 8 }]}
              onPress={() => setSelectedAsset(a.symbol)}
              activeOpacity={0.6}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {a.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Crypto selector */}
      <Text style={styles.sectionLabel}>Crypto</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        {CRYPTO_ASSETS.map((a) => {
          const isSelected = a.symbol === selectedAsset;
          return (
            <TouchableOpacity
              key={a.symbol}
              style={[styles.chip, isSelected && styles.chipSelected, { marginRight: 8 }]}
              onPress={() => setSelectedAsset(a.symbol)}
              activeOpacity={0.6}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {a.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Year selector */}
      <Text style={styles.sectionLabel}>Year</Text>
      <YearPicker
        selectedYear={selectedYear}
        years={availableYears}
        onYearChange={setSelectedYear}
      />

      {/* Historical price display */}
      {historicalData && !histLoading && (
        <View style={styles.currentPriceRow}>
          <Text style={styles.currentPriceText}>
            {asset.symbol} low in {selectedYear}:{' '}
          </Text>
          <Text style={styles.currentPriceAmount}>
            ${formatUSD(historicalPrice)}
          </Text>
        </View>
      )}

      {histLoading && (
        <Text style={styles.hintText}>Loading historical data...</Text>
      )}

      {histError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{histError}</Text>
        </View>
      )}

      {/* Investment amount */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Amount Invested</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={invested}
            onChangeText={setInvested}
            placeholder="1,000"
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'inv' && styles.inputFocused]}
            onFocus={() => setFocusedField('inv')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Amount invested"
          />
        </View>
      </View>

      {/* Results */}
      {hasResult && (
        <>
          <View style={styles.resultsGrid}>
            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>
                {asset.type === 'stock' ? 'Shares' : 'Coins'}
              </Text>
              <Text style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}>
                {result.shares.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Value Today</Text>
              <Text style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}>
                ${formatUSD(result.currentValue)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Total Return</Text>
              <Text style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}>
                {result.profit >= 0 ? '+' : ''}${formatUSD(Math.abs(result.profit))}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Multiplier</Text>
              <Text style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 20 }]}>
                {getMultiplierLabel(result.multiplier)}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={copyResult} activeOpacity={0.6} accessibilityRole="button" accessibilityLabel="Copy result">
            <Text style={[styles.copyButton, copyFailed && { color: theme.negative }]}>
              {copied ? '\u2713 Copied!' : copyFailed ? 'Copy failed' : '\u2398 Copy result'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {!hasResult && !histLoading && !histError && (
        <Text style={styles.hintText}>Enter an amount to see what could have been</Text>
      )}

      <Text style={styles.disclaimerText}>
        Based on historical data. Past performance does not guarantee future results. Not financial advice.
      </Text>
    </View>
  );
}

export default memo(TimeMachineCalc);
