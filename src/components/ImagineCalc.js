/**
 * ImagineCalc — The flagship "Imagine If..." DCA scenario calculator.
 *
 * Features:
 *   - Crypto selector chips with live price indicator
 *   - Grouped inputs with labels and helper text
 *   - Multiplier preset chips for quick target price selection
 *   - Time horizon presets (6mo, 1yr, 2yr, 5yr, 10yr)
 *   - Animated growth chart (SVG area chart)
 *   - Summary result cards with profit/multiplier
 *   - Dynamic descriptive sentence that updates with inputs
 *   - Full keyboard accessibility and ARIA attributes
 *   - Live-updating results as inputs change
 */

import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
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

const MULTIPLIER_PRESETS = [2, 3, 5, 10, 25, 50, 100];

const MONTHS_PRESETS = [
  { label: '6mo', value: 6 },
  { label: '1yr', value: 12 },
  { label: '2yr', value: 24 },
  { label: '5yr', value: 60 },
  { label: '10yr', value: 120 },
];

// ─── Component ──────────────────────────────────────────────────────────────

function ImagineCalc({ prices, loading }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chartWidth, setChartWidth] = useState(300);

  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [initialInvestment, setInitialInvestment] = useState('1000');
  const [monthlyDCA, setMonthlyDCA] = useState('100');
  const [targetPrice, setTargetPrice] = useState('');
  const [months, setMonths] = useState('12');
  const [selectedMultiplier, setSelectedMultiplier] = useState(2);
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

  // Recalculate target when switching crypto (if multiplier is active)
  useEffect(() => {
    if (selectedMultiplier && currentPrice > 0 && hasSetInitialTarget) {
      setTargetPrice(String(Math.round(currentPrice * selectedMultiplier)));
    }
  }, [selectedCrypto, currentPrice, selectedMultiplier]);

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

  const handleMultiplierPress = useCallback((mult) => {
    setSelectedMultiplier(mult);
    if (currentPrice > 0) {
      setTargetPrice(String(Math.round(currentPrice * mult)));
    }
  }, [currentPrice]);

  const handleTargetPriceChange = useCallback((text) => {
    setTargetPrice(text);
    setSelectedMultiplier(null);
  }, []);

  const handleMonthsPresetPress = useCallback((value) => {
    setMonths(String(value));
  }, []);

  // ─── Calculation ──────────────────────────────────────────────────────────

  const result = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyDCA) || 0;
    const target = parseFloat(targetPrice);
    const m = parseFloat(months);
    if ((init <= 0 && monthly <= 0) || isNaN(target) || isNaN(m) || currentPrice <= 0) return null;
    return calculateImagine(init, monthly, currentPrice, target, m);
  }, [initialInvestment, monthlyDCA, currentPrice, targetPrice, months]);

  const hasResult = result !== null;
  const isGain = hasResult && result.profit >= 0;

  // Chart data props
  const chartProps = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyDCA) || 0;
    const target = parseFloat(targetPrice) || 0;
    const m = parseInt(months) || 0;
    if ((init <= 0 && monthly <= 0) || target <= 0 || m <= 0 || currentPrice <= 0) return null;
    return { initialInvestment: init, monthlyDCA: monthly, currentPrice, targetPrice: target, months: m };
  }, [initialInvestment, monthlyDCA, currentPrice, targetPrice, months]);

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

      {/* Dynamic descriptive sentence */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          Imagine you invest{' '}
          <Text style={styles.descHighlight}>${initialInvestment || '0'}</Text> in{' '}
          <Text style={styles.descHighlight}>{crypto.name}</Text>
          {currentPrice > 0 && (
            <>
              {' '}today at{' '}
              <Text style={styles.descHighlight}>${formatUSD(currentPrice)}</Text>
            </>
          )}
          {monthlyDCA ? (
            <>
              , add <Text style={styles.descHighlight}>${monthlyDCA}</Text> monthly
            </>
          ) : null}
          {months ? (
            <>
              {' '}for <Text style={styles.descHighlight}>{months}</Text> months
            </>
          ) : null}
          {targetPrice ? (
            <>
              , and {crypto.symbol} reaches{' '}
              <Text style={styles.descHighlight}>${targetPrice}</Text>...
            </>
          ) : (
            '...'
          )}
        </Text>
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

      {/* ─── Investment Inputs ───────────────────────────────────────── */}
      <View style={styles.inputGroup}>
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
        <Text style={styles.inputHelperText}>One-time lump sum at today's price</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly DCA</Text>
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
        <Text style={styles.inputHelperText}>Dollar-cost average — invest this amount each month</Text>
      </View>

      {/* ─── Target Price with Multiplier Chips ──────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Target Price</Text>
        <View style={styles.chipRow}>
          {MULTIPLIER_PRESETS.map((mult) => {
            const isSelected = selectedMultiplier === mult;
            return (
              <TouchableOpacity
                key={mult}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleMultiplierPress(mult)}
                activeOpacity={0.6}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Set target to ${mult}x current price`}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {mult}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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

      {/* ─── Time Horizon with Presets ───────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Time Horizon</Text>
        <View style={styles.chipRow}>
          {MONTHS_PRESETS.map((preset) => {
            const isSelected = parseInt(months) === preset.value;
            return (
              <TouchableOpacity
                key={preset.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleMonthsPresetPress(preset.value)}
                activeOpacity={0.6}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Set time horizon to ${preset.label}`}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
        {targetDate && (
          <Text style={styles.inputHelperText}>That's {targetDate}</Text>
        )}
      </View>

      {/* ─── Growth Chart ────────────────────────────────────────────── */}
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
          />
        </View>
      )}

      {/* ─── Results Grid ────────────────────────────────────────────── */}
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

      {!hasResult && (
        <Text style={styles.hintText}>Enter values above to imagine your future</Text>
      )}

      <Text style={styles.disclaimerText}>
        For imagination only. Assumes all purchases at today's price. Not financial advice.
      </Text>
    </View>
  );
}

export default memo(ImagineCalc);
