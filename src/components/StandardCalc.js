/**
 * StandardCalc — Classic calculator with grid button layout.
 *
 * Features:
 *   - Expression display with live preview
 *   - Grid layout: numbers, operators, functions
 *   - Keyboard-style button interactions
 *   - Expression evaluation via safe Function constructor
 *   - Copy result to clipboard
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const BUTTONS = [
  ['C', '\u232B', '%', '\u00F7'],
  ['7', '8', '9', '\u00D7'],
  ['4', '5', '6', '\u2212'],
  ['1', '2', '3', '+'],
  ['\u00B1', '0', '.', '='],
];

function evaluate(expression) {
  try {
    const sanitized = expression
      .replace(/\u00D7/g, '*')
      .replace(/\u00F7/g, '/')
      .replace(/\u2212/g, '-');
    if (/[^0-9+\-*/.() ]/.test(sanitized)) return null;
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized});`)();
    if (!isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function formatDisplay(val) {
  if (val === null || val === undefined) return '';
  const rounded = Math.round(val * 1e10) / 1e10;
  if (Number.isInteger(rounded)) return rounded.toLocaleString();
  return parseFloat(rounded.toFixed(10)).toLocaleString(undefined, { maximumFractionDigits: 10 });
}

function StandardCalc() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [display, setDisplay] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const isOperator = (ch) => ['+', '\u2212', '\u00D7', '\u00F7'].includes(ch);

  const preview = (() => {
    if (display === '0' || display === '') return null;
    const result = evaluate(display);
    if (result === null) return null;
    const formatted = formatDisplay(result);
    if (formatted === display || formatted === display.replace(/,/g, '')) return null;
    return formatted;
  })();

  const handlePress = useCallback(
    (btn) => {
      switch (btn) {
        case 'C':
          setDisplay('0');
          setJustEvaluated(false);
          return;
        case '\u232B':
          setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
          setJustEvaluated(false);
          return;
        case '=': {
          const result = evaluate(display);
          if (result !== null) {
            setDisplay(formatDisplay(result));
            setJustEvaluated(true);
          }
          return;
        }
        case '\u00B1':
          setDisplay((prev) => {
            if (prev === '0') return '0';
            return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
          });
          return;
        case '%': {
          const result = evaluate(display);
          if (result !== null) {
            setDisplay(formatDisplay(result / 100));
            setJustEvaluated(true);
          }
          return;
        }
        default: {
          const isOp = isOperator(btn);
          const isDot = btn === '.';
          setDisplay((prev) => {
            if (justEvaluated) {
              if (isOp) {
                setJustEvaluated(false);
                return prev + ' ' + btn + ' ';
              }
              setJustEvaluated(false);
              return isDot ? '0.' : btn;
            }
            if (isOp) {
              if (isOperator(prev.trim().slice(-1)))
                return prev.trim().slice(0, -1) + btn + ' ';
              return prev + ' ' + btn + ' ';
            }
            if (isDot) {
              const parts = prev.split(/[+\u2212\u00D7\u00F7]/);
              if (parts[parts.length - 1].includes('.')) return prev;
              if (prev === '0') return '0.';
              return prev + '.';
            }
            if (prev === '0') return btn;
            return prev + btn;
          });
        }
      }
    },
    [display, justEvaluated],
  );

  const copyResult = useCallback(async () => {
    const value = evaluate(display);
    const text = value !== null ? formatDisplay(value) : display;
    try {
      await Clipboard.setStringAsync(text.replace(/,/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [display]);

  const getButtonStyle = (btn) => {
    if (btn === '=') return [styles.calcBtn, styles.calcBtnEquals];
    if (isOperator(btn) || btn === '\u00F7') return [styles.calcBtn, styles.calcBtnOperator];
    if (['C', '\u232B', '%', '\u00B1'].includes(btn)) return [styles.calcBtn, styles.calcBtnFunction];
    return [styles.calcBtn];
  };

  const getTextStyle = (btn) => {
    if (btn === '=') return [styles.calcBtnText, styles.calcBtnTextEquals];
    if (isOperator(btn) || btn === '\u00F7') return [styles.calcBtnText, styles.calcBtnTextOperator];
    if (['C', '\u232B', '%', '\u00B1'].includes(btn)) return [styles.calcBtnText, styles.calcBtnTextFunction];
    return [styles.calcBtnText];
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Calculator</Text>

      {/* Display */}
      <View style={styles.calcDisplay}>
        {preview !== null && (
          <Text style={styles.calcPreview}>{preview}</Text>
        )}
        <Text
          style={styles.calcDisplayText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          accessibilityLiveRegion="polite"
        >
          {display}
        </Text>
      </View>

      {/* Button grid */}
      <View style={styles.calcGrid}>
        {BUTTONS.map((row, ri) => (
          <View key={ri} style={styles.calcRow}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={getButtonStyle(btn)}
                activeOpacity={0.5}
                onPress={() => handlePress(btn)}
                accessibilityRole="button"
                accessibilityLabel={
                  btn === '\u232B' ? 'Backspace'
                    : btn === '\u00B1' ? 'Toggle sign'
                    : btn === '\u00D7' ? 'Multiply'
                    : btn === '\u00F7' ? 'Divide'
                    : btn === '\u2212' ? 'Subtract'
                    : btn
                }
              >
                <Text style={getTextStyle(btn)}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Copy */}
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
    </View>
  );
}

export default memo(StandardCalc);
