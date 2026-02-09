/**
 * TimeMachineCalc — Historical "What if I invested in X in year Y?" calculator.
 *
 * Features:
 *   - Asset selector (stocks + crypto) with categorized chips
 *   - Year picker with scrollable modal
 *   - Hardcoded split-adjusted historical prices (stocks + crypto)
 *   - Result cards showing shares/coins, current value, profit, multiplier
 *   - Inline loading and error states
 *   - Full accessibility labels
 */

import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import { SUPPORTED_STOCKS, SUPPORTED_CRYPTOS, STOCK_HISTORICAL_PRICES, CRYPTO_HISTORICAL_PRICES, STOCK_CURRENT_PRICES } from '../utils/constants';
import { calculateTimeMachine, formatUSD } from '../utils/imaginecalc';
import createStyles from '../styles';
import YearPicker from './YearPicker';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// Earliest year with reliable data per asset
const ASSET_START_YEARS = {
  TSLA: 2010, AAPL: 2005, AMZN: 2005, GOOG: 2005, NVDA: 2005,
  META: 2012, MSFT: 2005, NFLX: 2005, 'BRK.B': 2005, JPM: 2005,
  BTC: 2011, ETH: 2016, SOL: 2021, DOGE: 2014, XRP: 2014,
};

const ALL_YEARS = [];
for (let y = 2025; y >= 2005; y--) ALL_YEARS.push(y);

// ─── Component ──────────────────────────────────────────────────────────────

function TimeMachineCalc({ prices }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedAsset, setSelectedAsset] = useState('TSLA');
  const [selectedYear, setSelectedYear] = useState(2015);
  const [invested, setInvested] = useState('1000');
  const [focusedField, setFocusedField] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [histError, setHistError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const asset = ALL_ASSETS.find((a) => a.symbol === selectedAsset);

  // Filter available years based on asset's data availability
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

  // ─── Resolve historical price from hardcoded data ────────────────────────

  useEffect(() => {
    if (!asset) return;

    setHistError(null);

    // Look up price from hardcoded tables (split-adjusted Year Open prices)
    const lookup = asset.type === 'crypto'
      ? CRYPTO_HISTORICAL_PRICES[asset.id]
      : STOCK_HISTORICAL_PRICES[asset.symbol];

    if (!lookup || lookup[selectedYear] == null) {
      setHistoricalData(null);
      setHistError(`No data available for ${asset.symbol} in ${selectedYear}.`);
      return;
    }

    const price = lookup[selectedYear];
    setHistoricalData({
      symbol: asset.symbol,
      year: selectedYear,
      low: price,
      high: price,
      close: price,
    });
  }, [asset, selectedYear]);

  // Get current price (live for crypto, fallback for stocks)
  const currentPrice = useMemo(() => {
    if (!asset) return 0;
    if (asset.type === 'crypto' && prices?.[asset.id]) return prices[asset.id].usd;
    if (asset.type === 'stock' && STOCK_CURRENT_PRICES[asset.symbol]) return STOCK_CURRENT_PRICES[asset.symbol];
    return 0;
  }, [asset, prices]);

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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Time Machine</Text>

      {/* Dynamic descriptive sentence */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          What if you invested{' '}
          <Text style={styles.descHighlight}>${invested || '1,000'}</Text> in{' '}
          <Text style={styles.descHighlight}>{asset?.name || 'Tesla'}</Text> in{' '}
          <Text style={styles.descHighlight}>{selectedYear}</Text>?
        </Text>
      </View>

      {/* ─── Asset Selectors ─────────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Stocks</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {STOCK_ASSETS.map((a) => {
          const isSelected = a.symbol === selectedAsset;
          return (
            <TouchableOpacity
              key={a.symbol}
              style={[styles.chip, isSelected && styles.chipSelected, { marginRight: 8 }]}
              onPress={() => setSelectedAsset(a.symbol)}
              activeOpacity={0.6}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Select ${a.name}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {a.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>Crypto</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {CRYPTO_ASSETS.map((a) => {
          const isSelected = a.symbol === selectedAsset;
          return (
            <TouchableOpacity
              key={a.symbol}
              style={[styles.chip, isSelected && styles.chipSelected, { marginRight: 8 }]}
              onPress={() => setSelectedAsset(a.symbol)}
              activeOpacity={0.6}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Select ${a.name}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {a.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ─── Year Selector ───────────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Year</Text>
      <YearPicker
        selectedYear={selectedYear}
        years={availableYears}
        onYearChange={setSelectedYear}
      />

      {/* Historical price display */}
      {historicalData && (
        <View style={styles.currentPriceRow}>
          <Text style={styles.currentPriceText}>
            {asset.symbol} in Jan {selectedYear}:{' '}
          </Text>
          <Text style={styles.currentPriceAmount}>${formatUSD(historicalPrice)}</Text>
        </View>
      )}

      {histError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{histError}</Text>
        </View>
      )}

      {/* ─── Investment Amount ───────────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Amount Invested</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={invested}
            onChangeText={setInvested}
            placeholder="1,000"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'inv' && styles.inputFocused]}
            onFocus={() => setFocusedField('inv')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Amount invested in dollars"
            accessibilityHint="Enter how much you would have invested"
          />
        </View>
        <Text style={styles.inputHelperText}>How much you would have put in back then</Text>
      </View>

      {/* ─── Results ─────────────────────────────────────────────────── */}
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
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}
                accessibilityLiveRegion="polite"
              >
                ${formatUSD(result.currentValue)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Total Return</Text>
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}
                accessibilityLiveRegion="polite"
              >
                {result.profit >= 0 ? '+' : ''}${formatUSD(Math.abs(result.profit))}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Multiplier</Text>
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 22 }]}
                accessibilityLiveRegion="polite"
              >
                {getMultiplierLabel(result.multiplier)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={copyResult}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel="Copy result to clipboard"
          >
            <Text style={[styles.copyButton, copyFailed && { color: theme.negative }]}>
              {copied ? '\u2713 Copied!' : copyFailed ? 'Copy failed' : '\u2398 Copy result'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {!hasResult && !histError && (
        <Text style={styles.hintText}>Enter an amount to see what could have been</Text>
      )}

      <Text style={styles.disclaimerText}>
        Based on historical data. Past performance does not guarantee future results. Not financial advice.
      </Text>
    </View>
  );
}

export default memo(TimeMachineCalc);
