import { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import { SUPPORTED_CRYPTOS } from '../utils/constants';
import { calculateImagine, formatUSD, formatCryptoAmount } from '../utils/imaginecalc';
import createStyles from '../styles';

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

function ImagineCalc({ prices, loading }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

  // When switching crypto, recalculate target if multiplier is active
  useEffect(() => {
    if (selectedMultiplier && currentPrice > 0 && hasSetInitialTarget) {
      setTargetPrice(String(Math.round(currentPrice * selectedMultiplier)));
    }
  }, [selectedCrypto, currentPrice, selectedMultiplier]);

  // Effective multiplier for the hint
  const effectiveMultiplier = useMemo(() => {
    const target = parseFloat(targetPrice);
    if (currentPrice > 0 && target > 0) return target / currentPrice;
    return null;
  }, [targetPrice, currentPrice]);

  // Target date for months hint
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
    setSelectedMultiplier(null); // Clear chip when manually editing
  }, []);

  const handleMonthsPresetPress = useCallback((value) => {
    setMonths(String(value));
  }, []);

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

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Imagine If...</Text>

      {/* Description */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          Imagine you invest{' '}
          <Text style={styles.descHighlight}>
            ${initialInvestment || '0'}
          </Text>{' '}
          in{' '}
          <Text style={styles.descHighlight}>{crypto.name}</Text>
          {currentPrice > 0 && (
            <>
              {' '}today at{' '}
              <Text style={styles.descHighlight}>
                ${formatUSD(currentPrice)}
              </Text>
            </>
          )}
          {monthlyDCA ? (
            <>
              , add{' '}
              <Text style={styles.descHighlight}>${monthlyDCA}</Text>{' '}
              monthly
            </>
          ) : null}
          {months ? (
            <>
              {' '}for{' '}
              <Text style={styles.descHighlight}>{months}</Text> months
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

      {/* Crypto selector */}
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
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
              >
                {c.symbol}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current price */}
      {currentPrice > 0 && (
        <View style={styles.currentPriceRow}>
          <View style={styles.liveDot} />
          <Text style={styles.currentPriceText}>
            {crypto.symbol} is currently{' '}
          </Text>
          <Text style={styles.currentPriceAmount}>
            ${formatUSD(currentPrice)}
          </Text>
        </View>
      )}

      {loading && currentPrice === 0 && (
        <Text style={styles.hintText}>Loading prices...</Text>
      )}

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Initial Investment</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={initialInvestment}
            onChangeText={setInitialInvestment}
            placeholder="1,000"
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'init' && styles.inputFocused]}
            onFocus={() => setFocusedField('init')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Initial investment amount"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly DCA</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={monthlyDCA}
            onChangeText={setMonthlyDCA}
            placeholder="100"
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'dca' && styles.inputFocused]}
            onFocus={() => setFocusedField('dca')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Monthly dollar cost average amount"
          />
        </View>
      </View>

      {/* Target Price with multiplier chips */}
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
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'target' && styles.inputFocused]}
            onFocus={() => setFocusedField('target')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Target crypto price"
          />
        </View>
        {effectiveMultiplier !== null && (
          <Text style={styles.hintText}>
            That's {getMultiplierLabel(effectiveMultiplier)} from today's price
          </Text>
        )}
      </View>

      {/* Months with presets */}
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
          placeholderTextColor={theme.textTertiary}
          keyboardType="number-pad"
          selectionColor={theme.accent}
          style={[styles.input, focusedField === 'months' && styles.inputFocused]}
          onFocus={() => setFocusedField('months')}
          onBlur={() => setFocusedField(null)}
          accessibilityLabel="Investment time horizon in months"
        />
        {targetDate && (
          <Text style={styles.hintText}>
            That's {targetDate}
          </Text>
        )}
      </View>

      {/* Results */}
      {hasResult && (
        <>
          <View style={styles.resultsGrid}>
            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>Total Invested</Text>
              <Text style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}>
                ${formatUSD(result.totalInvested)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>Total {crypto.symbol}</Text>
              <Text style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}>
                {formatCryptoAmount(result.totalCoins)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: theme.accentBg, borderColor: theme.accentBorder }]}>
              <Text style={styles.investResultLabel}>Portfolio Value</Text>
              <Text style={[styles.investResultValue, { color: theme.accent, fontSize: 18 }]}>
                ${formatUSD(result.portfolioValue)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Profit</Text>
              <Text style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}>
                {result.profit >= 0 ? '+' : ''}${formatUSD(Math.abs(result.profit))}
              </Text>
            </View>
          </View>

          {/* Multiplier */}
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <View style={[styles.investResultCard, styles.multiplierBadge, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={[styles.multiplierText, { color: isGain ? theme.positive : theme.negative, fontSize: 20 }]}>
                {getMultiplierLabel(result.multiplier)}
              </Text>
            </View>
          </View>

          {/* Copy */}
          <TouchableOpacity onPress={copyResult} activeOpacity={0.6} accessibilityRole="button" accessibilityLabel="Copy result">
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
