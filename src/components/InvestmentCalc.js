import { useState, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import styles from '../styles';

function getMultiplierLabel(m) {
  if (m === null || m <= 0) return null;
  if (Number.isInteger(m)) return `${m}x`;
  if (m >= 100) return `${Math.round(m)}x`;
  if (m >= 10) return `${Math.round(m * 10) / 10}x`;
  return `${Math.round(m * 100) / 100}x`;
}

function InvestmentCalc() {
  const [pctGain, setPctGain] = useState('');
  const [invested, setInvested] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const pct = parseFloat(pctGain);
  const inv = parseFloat(invested);
  const hasInput =
    !isNaN(pct) && !isNaN(inv) && invested !== '' && pctGain !== '';
  const multiplier =
    !isNaN(pct) && pctGain !== '' ? 1 + pct / 100 : null;
  const finalValue = hasInput ? inv * (1 + pct / 100) : null;
  const profit = hasInput ? finalValue - inv : null;

  const isPositive = pct >= 0;

  const profitColor = hasInput
    ? isPositive
      ? '#22c55e'
      : '#ef4444'
    : 'rgba(255,255,255,0.15)';

  const profitBg = hasInput
    ? isPositive
      ? 'rgba(34,197,94,0.08)'
      : 'rgba(239,68,68,0.08)'
    : 'rgba(255,255,255,0.02)';

  const profitBorder = hasInput
    ? isPositive
      ? 'rgba(34,197,94,0.2)'
      : 'rgba(239,68,68,0.2)'
    : 'rgba(255,255,255,0.05)';

  const multBg =
    hasInput && multiplier > 0
      ? isPositive
        ? 'rgba(34,197,94,0.08)'
        : 'rgba(239,68,68,0.08)'
      : 'rgba(255,255,255,0.02)';

  const multBorder =
    hasInput && multiplier > 0
      ? isPositive
        ? 'rgba(34,197,94,0.25)'
        : 'rgba(239,68,68,0.25)'
      : 'rgba(255,255,255,0.05)';

  const multColor =
    hasInput && multiplier > 0
      ? isPositive
        ? '#22c55e'
        : '#ef4444'
      : 'rgba(255,255,255,0.15)';

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
      {/* Description */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          If a stock gained{' '}
          <Text style={styles.descHighlight}>{pctGain || 'X'}%</Text>, how much
          would <Text style={styles.descHighlight}>${invested || 'Y'}</Text>{' '}
          become?
        </Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={pctGain}
            onChangeText={setPctGain}
            placeholder="% Gain"
            placeholderTextColor="rgba(255,255,255,0.25)"
            keyboardType="decimal-pad"
            selectionColor="#f59e0b"
            style={[
              styles.input,
              focusedField === 'pct' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('pct')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Percentage gain"
            accessibilityHint="Enter the percentage gain"
          />
          {pctGain !== '' && (
            <Text style={styles.inputSuffix}>%</Text>
          )}
        </View>

        <Text style={styles.operator}>on</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={invested}
            onChangeText={setInvested}
            placeholder="Invested"
            placeholderTextColor="rgba(255,255,255,0.25)"
            keyboardType="decimal-pad"
            selectionColor="#f59e0b"
            style={[
              styles.input,
              { paddingLeft: 28 },
              focusedField === 'inv' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('inv')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Amount invested"
            accessibilityHint="Enter the dollar amount invested"
          />
        </View>
      </View>

      {/* Results row */}
      <View style={styles.investResultRow}>
        {/* Profit */}
        <View
          style={[
            styles.investResultCard,
            { flex: 1, backgroundColor: profitBg, borderColor: profitBorder },
          ]}
        >
          <Text style={styles.investResultLabel}>Profit</Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.investResultValue,
              { color: profitColor, fontSize: hasInput ? 18 : 16 },
            ]}
          >
            {hasInput
              ? `${profit >= 0 ? '+' : ''}$${profit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : '\u2014'}
          </Text>
        </View>

        {/* Multiplier */}
        <View
          style={[
            styles.investResultCard,
            styles.multiplierBadge,
            { backgroundColor: multBg, borderColor: multBorder },
          ]}
        >
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.multiplierText,
              {
                color: multColor,
                fontSize: hasInput && multiplier > 0 ? 20 : 16,
              },
            ]}
          >
            {hasInput && multiplier > 0
              ? getMultiplierLabel(multiplier)
              : '\u2014'}
          </Text>
        </View>

        {/* Total Value */}
        <View
          style={[
            styles.investResultCard,
            {
              flex: 1,
              backgroundColor: hasInput
                ? 'rgba(245,158,11,0.08)'
                : 'rgba(255,255,255,0.02)',
              borderColor: hasInput
                ? 'rgba(245,158,11,0.2)'
                : 'rgba(255,255,255,0.05)',
            },
          ]}
        >
          <Text style={styles.investResultLabel}>Total Value</Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.investResultValue,
              {
                color: hasInput ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                fontSize: hasInput ? 18 : 16,
              },
            ]}
          >
            {hasInput
              ? `$${finalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : '\u2014'}
          </Text>
        </View>
      </View>

      {/* Validation hint */}
      {!hasInput && (
        <Text style={styles.hintText}>Enter values above</Text>
      )}

      {/* Copy */}
      {hasInput && (
        <TouchableOpacity
          onPress={copyResult}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Copy result to clipboard"
        >
          <Text style={[styles.copyButton, copyFailed && { color: '#ef4444' }]}>
            {copied ? '\u2713 Copied!' : copyFailed ? 'Copy failed' : '\u2398 Copy result'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default memo(InvestmentCalc);
