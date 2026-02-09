/**
 * InvestmentCalc — "If a stock gained X%, how much would $Y become?"
 *
 * Features:
 *   - Horizontal input layout (% gain × $ invested)
 *   - Three result cards: Profit, Multiplier, Total Value
 *   - Color-coded results (green for gain, red for loss)
 *   - Live-updating results as inputs change
 *   - Copy result to clipboard
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

function getMultiplierLabel(m) {
  if (m === null || m <= 0) return null;
  if (Number.isInteger(m)) return `${m}x`;
  if (m >= 100) return `${Math.round(m)}x`;
  if (m >= 10) return `${Math.round(m * 10) / 10}x`;
  return `${Math.round(m * 100) / 100}x`;
}

function InvestmentCalc() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [pctGain, setPctGain] = useState('');
  const [invested, setInvested] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const pct = parseFloat(pctGain);
  const inv = parseFloat(invested);
  const hasInput = !isNaN(pct) && !isNaN(inv) && invested !== '' && pctGain !== '';
  const multiplier = !isNaN(pct) && pctGain !== '' ? 1 + pct / 100 : null;
  const finalValue = hasInput ? inv * (1 + pct / 100) : null;
  const profit = hasInput ? finalValue - inv : null;
  const isPositive = pct >= 0;

  // Dynamic colors based on gain/loss
  const profitColor = hasInput ? (isPositive ? theme.positive : theme.negative) : theme.textMuted;
  const profitBg = hasInput ? (isPositive ? theme.positiveBg : theme.negativeBg) : theme.surfaceHover;
  const profitBorder = hasInput ? (isPositive ? theme.positiveBorder : theme.negativeBorder) : theme.surfaceBorder;
  const multBg = hasInput && multiplier > 0 ? (isPositive ? theme.positiveBg : theme.negativeBg) : theme.surfaceHover;
  const multBorder = hasInput && multiplier > 0 ? (isPositive ? theme.positiveBorder : theme.negativeBorder) : theme.surfaceBorder;
  const multColor = hasInput && multiplier > 0 ? (isPositive ? theme.positive : theme.negative) : theme.textMuted;

  const copyResult = useCallback(async () => {
    const text = `${pctGain}% gain on $${parseFloat(invested).toLocaleString()} \u2192 $${finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${getMultiplierLabel(multiplier)}, +$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [pctGain, invested, finalValue, multiplier, profit]);

  return (
    <View style={styles.card}>
      {/* Card title */}
      <Text style={styles.cardLabel}>Investment Return</Text>

      {/* Description */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          If a stock gained{' '}
          <Text style={styles.descHighlight}>{pctGain || 'X'}%</Text>, how much
          would <Text style={styles.descHighlight}>${invested || 'Y'}</Text> become?
        </Text>
      </View>

      {/* Input row */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={pctGain}
            onChangeText={setPctGain}
            placeholder="% Gain"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, focusedField === 'pct' && styles.inputFocused]}
            onFocus={() => setFocusedField('pct')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Percentage gain or loss"
            accessibilityHint="Enter the percentage gain (positive) or loss (negative)"
          />
          {pctGain !== '' && <Text style={styles.inputSuffix}>%</Text>}
        </View>

        <Text style={styles.operator}>on</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={invested}
            onChangeText={setInvested}
            placeholder="Invested"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'inv' && styles.inputFocused]}
            onFocus={() => setFocusedField('inv')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Amount invested in dollars"
            accessibilityHint="Enter the dollar amount you invested"
          />
        </View>
      </View>

      {/* Result cards */}
      <View style={styles.investResultRow}>
        <View style={[styles.investResultCard, { flex: 1, backgroundColor: profitBg, borderColor: profitBorder }]}>
          <Text style={styles.investResultLabel}>Profit</Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.investResultValue, { color: profitColor, fontSize: hasInput ? 18 : 16 }]}
          >
            {hasInput
              ? `${profit >= 0 ? '+' : ''}$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '\u2014'}
          </Text>
        </View>

        <View style={[styles.investResultCard, styles.multiplierBadge, { backgroundColor: multBg, borderColor: multBorder }]}>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.multiplierText, { color: multColor, fontSize: hasInput && multiplier > 0 ? 20 : 16 }]}
          >
            {hasInput && multiplier > 0 ? getMultiplierLabel(multiplier) : '\u2014'}
          </Text>
        </View>

        <View style={[styles.investResultCard, { flex: 1, backgroundColor: hasInput ? theme.accentBg : theme.surfaceHover, borderColor: hasInput ? theme.accentBorder : theme.surfaceBorder }]}>
          <Text style={styles.investResultLabel}>Total Value</Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.investResultValue, { color: hasInput ? theme.accent : theme.textMuted, fontSize: hasInput ? 18 : 16 }]}
          >
            {hasInput
              ? `$${finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '\u2014'}
          </Text>
        </View>
      </View>

      {!hasInput && <Text style={styles.hintText}>Enter values above</Text>}

      {hasInput && (
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
      )}
    </View>
  );
}

export default memo(InvestmentCalc);
