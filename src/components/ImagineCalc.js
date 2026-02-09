/**
 * ImagineCalc — The flagship "Imagine If..." DCA scenario calculator.
 *
 * Features:
 *   - Crypto selector chips with live price indicator
 *   - Compact 2-column input layout
 *   - Animated growth chart (SVG area chart)
 *   - Summary result cards with profit/multiplier
 *   - Full keyboard accessibility and ARIA attributes
 *   - Live-updating results as inputs change
 */

import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, UIManager } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import { SUPPORTED_CRYPTOS } from '../utils/constants';
import { calculateImagine, formatUSD, formatCryptoAmount } from '../utils/imaginecalc';
import createStyles from '../styles';
import GrowthChart from './GrowthChart';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMultiplierLabel(m) {
  if (m <= 0) return '0x';
  if (Number.isInteger(m)) return `${m}x`;
  if (m >= 100) return `${Math.round(m)}x`;
  if (m >= 10) return `${Math.round(m * 10) / 10}x`;
  return `${Math.round(m * 100) / 100}x`;
}

// ─── Component ──────────────────────────────────────────────────────────────

function ImagineCalc({ prices, loading, onScrubChange }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chartWidth, setChartWidth] = useState(300);

  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [initialInvestment, setInitialInvestment] = useState('1000');
  const [monthlyDCA, setMonthlyDCA] = useState('100');
  const [targetPrice, setTargetPrice] = useState('');
  const [months, setMonths] = useState('12');
  const [dcaModel, setDcaModel] = useState('bestCase');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [hasSetInitialTarget, setHasSetInitialTarget] = useState(false);

  const crypto = SUPPORTED_CRYPTOS.find((c) => c.id === selectedCrypto);
  const currentPrice = prices?.[selectedCrypto]?.usd ?? 0;

  // Set initial target price to 2x once prices load
  useEffect(() => {
    if (currentPrice > 0 && !hasSetInitialTarget) {
      setTargetPrice(String(Math.round(currentPrice * 2)));
      setHasSetInitialTarget(true);
    }
  }, [currentPrice, hasSetInitialTarget]);

  // Recalculate target when switching crypto
  useEffect(() => {
    if (currentPrice > 0 && hasSetInitialTarget) {
      setTargetPrice(String(Math.round(currentPrice * 2)));
    }
  }, [selectedCrypto, currentPrice]);

  // Effective multiplier display
  const effectiveMultiplier = useMemo(() => {
    const target = parseFloat(targetPrice);
    if (currentPrice > 0 && target > 0) return target / currentPrice;
    return null;
  }, [targetPrice, currentPrice]);

  // Target date for time horizon hint
  const targetDate = useMemo(() => {
    const m = parseInt(months);
    if (isNaN(m) || m <= 0) return null;
    const d = new Date();
    d.setMonth(d.getMonth() + m);
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [months]);

  const handleTargetPriceChange = useCallback((text) => {
    setTargetPrice(text);
  }, []);

  // ─── Calculation ──────────────────────────────────────────────────────────

  const result = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyDCA) || 0;
    const target = parseFloat(targetPrice);
    const m = parseFloat(months);
    if ((init <= 0 && monthly <= 0) || isNaN(target) || isNaN(m) || currentPrice <= 0) return null;
    return calculateImagine(init, monthly, currentPrice, target, m, dcaModel);
  }, [initialInvestment, monthlyDCA, currentPrice, targetPrice, months, dcaModel]);

  const hasResult = result !== null;
  const isGain = hasResult && result.profit >= 0;

  // Chart data props
  const chartProps = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyDCA) || 0;
    const target = parseFloat(targetPrice) || 0;
    const m = parseInt(months) || 0;
    if ((init <= 0 && monthly <= 0) || target <= 0 || m <= 0 || currentPrice <= 0) return null;
    return { initialInvestment: init, monthlyDCA: monthly, currentPrice, targetPrice: target, months: m, model: dcaModel };
  }, [initialInvestment, monthlyDCA, currentPrice, targetPrice, months, dcaModel]);

  // ─── Copy ─────────────────────────────────────────────────────────────────

  const copyResult = useCallback(async () => {
    if (!result) return;
    const text = `Imagine: $${formatUSD(result.totalInvested)} in ${crypto.name} \u2192 ${formatCryptoAmount(result.totalCoins)} ${crypto.symbol} \u2192 $${formatUSD(result.portfolioValue)} (${getMultiplierLabel(result.multiplier)}, ${result.profit >= 0 ? '+' : ''}$${formatUSD(result.profit)})`;
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [result, crypto]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      {/* Card header */}
      <Text style={styles.cardLabel}>Imagine Your Investment</Text>

      {/* Simple subtitle */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>Set your investment scenario</Text>
      </View>

      {/* ─── Crypto Selector ─────────────────────────────────────────── */}
      <Text style={styles.inputLabel}>Select Cryptocurrency</Text>
      <View style={styles.chipRow}>
        {SUPPORTED_CRYPTOS.map((c) => {
          const isSelected = c.id === selectedCrypto;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setSelectedCrypto(c.id)}
              activeOpacity={0.6}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Select ${c.name}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {c.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current price indicator */}
      {currentPrice > 0 && (
        <View style={styles.currentPriceRow}>
          <View style={styles.liveDot} />
          <Text style={styles.currentPriceText}>
            {crypto.symbol} is currently{' '}
          </Text>
          <Text style={styles.currentPriceAmount}>${formatUSD(currentPrice)}</Text>
        </View>
      )}
      {loading && currentPrice === 0 && (
        <Text style={styles.hintText}>Loading live prices...</Text>
      )}

      {/* ─── Investment Inputs (2-column grid) ───────────────────────── */}
      <View style={styles.inputRow2Col}>
        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Initial Investment</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={initialInvestment}
              onChangeText={setInitialInvestment}
              placeholder="1,000"
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="decimal-pad"
              selectionColor={theme.accent}
              style={[styles.input, { paddingLeft: 28 }, focusedField === 'init' && styles.inputFocused]}
              onFocus={() => setFocusedField('init')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel="Initial investment amount in dollars"
              accessibilityHint="Enter the amount you want to invest initially"
            />
          </View>
          <Text style={styles.inputHelperText}>Lump sum</Text>
        </View>

        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Monthly Contribution</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={monthlyDCA}
              onChangeText={setMonthlyDCA}
              placeholder="100"
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="decimal-pad"
              selectionColor={theme.accent}
              style={[styles.input, { paddingLeft: 28 }, focusedField === 'dca' && styles.inputFocused]}
              onFocus={() => setFocusedField('dca')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel="Monthly dollar cost average amount"
              accessibilityHint="Amount added every month automatically"
            />
          </View>
          <Text style={styles.inputHelperText}>Each month</Text>
        </View>
      </View>

      <View style={styles.inputRow2Col}>
        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Target Price</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={targetPrice}
              onChangeText={handleTargetPriceChange}
              placeholder="150,000"
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="decimal-pad"
              selectionColor={theme.accent}
              style={[styles.input, { paddingLeft: 28 }, focusedField === 'target' && styles.inputFocused]}
              onFocus={() => setFocusedField('target')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel="Target cryptocurrency price"
              accessibilityHint="The price you imagine the crypto reaching"
            />
          </View>
          {effectiveMultiplier !== null && (
            <Text style={styles.inputHelperText}>
              That's {getMultiplierLabel(effectiveMultiplier)} from today's price
            </Text>
          )}
        </View>

        <View style={styles.inputCol}>
          <Text style={styles.inputLabel}>Time Horizon</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={months}
              onChangeText={setMonths}
              placeholder="12"
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="number-pad"
              selectionColor={theme.accent}
              style={[styles.input, focusedField === 'months' && styles.inputFocused]}
              onFocus={() => setFocusedField('months')}
              onBlur={() => setFocusedField(null)}
              accessibilityLabel="Investment time horizon in months"
              accessibilityHint="How many months you plan to invest"
            />
            {months !== '' && <Text style={styles.inputSuffix}>mo</Text>}
          </View>
          {targetDate && (
            <Text style={styles.inputHelperText}>That's {targetDate}</Text>
          )}
        </View>
      </View>

      {/* ─── DCA Price Model ────────────────────────────────────────── */}
      <Text style={styles.inputLabel}>Price Model</Text>
      <View style={styles.chipRow}>
        {[
          { id: 'bestCase', label: 'Best Case' },
          { id: 'linear', label: 'Linear DCA' },
          { id: 'volatile', label: 'Volatile' },
        ].map((m) => {
          const isSelected = dcaModel === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setDcaModel(m.id)}
              activeOpacity={0.6}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${m.label} price model`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {dcaModel === 'bestCase' && (
        <Text style={styles.inputHelperText}>All purchases at today's price (most optimistic)</Text>
      )}
      {dcaModel === 'linear' && (
        <Text style={styles.inputHelperText}>Price rises steadily to target — buys get more expensive over time</Text>
      )}
      {dcaModel === 'volatile' && (
        <Text style={styles.inputHelperText}>Realistic ups & downs around the trend — each month's price varies</Text>
      )}

      {/* ─── Results Grid (above chart) ──────────────────────────────── */}
      {hasResult && (
        <>
          <View style={styles.resultsGrid}>
            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>Total Invested</Text>
              <Text
                style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}
                accessibilityLabel={`Total invested: $${formatUSD(result.totalInvested)}`}
              >
                ${formatUSD(result.totalInvested)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>Total {crypto.symbol}</Text>
              <Text
                style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}
                accessibilityLabel={`Total ${crypto.symbol}: ${formatCryptoAmount(result.totalCoins)}`}
              >
                {formatCryptoAmount(result.totalCoins)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Portfolio Value</Text>
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}
                accessibilityLiveRegion="polite"
              >
                ${formatUSD(result.portfolioValue)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Profit / Loss</Text>
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}
                accessibilityLiveRegion="polite"
              >
                {result.profit >= 0 ? '+' : ''}${formatUSD(Math.abs(result.profit))}
              </Text>
            </View>
          </View>

          {/* Multiplier badge */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <View style={[
              styles.investResultCard,
              styles.multiplierBadge,
              {
                backgroundColor: isGain ? theme.positiveBg : theme.negativeBg,
                borderColor: isGain ? theme.positiveBorder : theme.negativeBorder,
                borderRadius: 999,
                paddingHorizontal: 24,
              },
            ]}>
              <Text style={[styles.multiplierText, { color: isGain ? theme.positive : theme.negative, fontSize: 22 }]}>
                {getMultiplierLabel(result.multiplier)}
              </Text>
            </View>
          </View>

          {/* Copy result */}
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

      {/* ─── Growth Chart (below results) ────────────────────────────── */}
      {chartProps && (
        <View
          style={styles.chartContainer}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - 32)}
        >
          <Text style={styles.chartTitle}>Growth Projection</Text>
          <GrowthChart
            {...chartProps}
            theme={theme}
            width={chartWidth}
            onScrubChange={onScrubChange}
          />
        </View>
      )}

      {!hasResult && (
        <Text style={styles.hintText}>Enter values above to imagine your future</Text>
      )}

      <Text style={styles.disclaimerText}>
        {dcaModel === 'bestCase'
          ? "For imagination only. Assumes all purchases at today's price. Not financial advice."
          : dcaModel === 'linear'
          ? 'For imagination only. Assumes price rises linearly to target. Not financial advice.'
          : 'For imagination only. Simulated volatility — results vary. Not financial advice.'}
      </Text>
    </View>
  );
}

export default memo(ImagineCalc);
