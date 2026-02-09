import { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { calculate, formatResult } from '../utils/calculate';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const accessibilityLabels = {
  whatIs: { a: 'Percentage value', b: 'Base number' },
  whatPercent: { a: 'Part value', b: 'Whole value' },
  change: { a: 'Starting value', b: 'Ending value' },
};

const accessibilityHints = {
  whatIs: {
    a: 'Enter the percentage',
    b: 'Enter the number to calculate the percentage of',
  },
  whatPercent: {
    a: 'Enter the part value',
    b: 'Enter the whole value',
  },
  change: {
    a: 'Enter the starting value',
    b: 'Enter the ending value',
  },
};

function CalcCard({ type }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const result = useMemo(() => calculate(type, a, b), [type, a, b]);
  const hasInput = a !== '' && b !== '';

  const placeholders = {
    whatIs: { a: 'Percentage', b: 'Number' },
    whatPercent: { a: 'Part', b: 'Whole' },
    change: { a: 'From', b: 'To' },
  };
  const p = placeholders[type];

  const operatorSymbol =
    type === 'change' ? '\u2192' : type === 'whatPercent' ? '\u00F7' : '\u00D7';

  const descriptions = {
    whatIs: (valA, valB) => (
      <Text style={styles.descText}>
        What is{' '}
        <Text style={styles.descHighlight}>{valA || 'X'}%</Text> of{' '}
        <Text style={styles.descHighlight}>{valB || 'Y'}</Text>?
      </Text>
    ),
    whatPercent: (valA, valB) => (
      <Text style={styles.descText}>
        <Text style={styles.descHighlight}>{valA || 'X'}</Text> is what percent
        of <Text style={styles.descHighlight}>{valB || 'Y'}</Text>?
      </Text>
    ),
    change: (valA, valB) => (
      <Text style={styles.descText}>
        % change from{' '}
        <Text style={styles.descHighlight}>{valA || 'X'}</Text> to{' '}
        <Text style={styles.descHighlight}>{valB || 'Y'}</Text>
      </Text>
    ),
  };

  const copyResult = useCallback(async () => {
    const text = formatResult(result) + (type !== 'whatIs' ? '%' : '');
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [result, type]);

  return (
    <View style={styles.card}>
      {/* Description */}
      <View style={styles.descContainer}>
        {descriptions[type](a, b)}
      </View>

      {/* Inputs */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={a}
            onChangeText={setA}
            placeholder={p.a}
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[
              styles.input,
              focusedField === 'a' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('a')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel={accessibilityLabels[type].a}
            accessibilityHint={accessibilityHints[type].a}
          />
          {type === 'whatIs' && a !== '' && (
            <Text style={styles.inputSuffix}>%</Text>
          )}
        </View>

        <Text style={styles.operator}>{operatorSymbol}</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            value={b}
            onChangeText={setB}
            placeholder={p.b}
            placeholderTextColor={theme.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[
              styles.input,
              focusedField === 'b' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('b')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel={accessibilityLabels[type].b}
            accessibilityHint={accessibilityHints[type].b}
          />
        </View>
      </View>

      {/* Result */}
      <View
        style={[
          styles.resultBox,
          hasInput && result !== null && styles.resultBoxActive,
        ]}
      >
        <Text style={styles.resultLabel}>Result</Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.resultValue,
            hasInput && result !== null && styles.resultValueActive,
          ]}
        >
          {hasInput && result !== null
            ? `${formatResult(result)}${type !== 'whatIs' ? '%' : ''}`
            : '\u2014'}
        </Text>
      </View>

      {/* Validation feedback */}
      {hasInput && result === null && (
        <Text style={styles.errorText}>Cannot divide by zero</Text>
      )}
      {!hasInput && (
        <Text style={styles.hintText}>Enter values above</Text>
      )}

      {/* Copy button */}
      {hasInput && result !== null && (
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

export default memo(CalcCard);
