import { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import styles from '../styles';

const BUTTONS = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
];

function evaluate(expression) {
  try {
    // Replace display symbols with JS operators
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Only allow digits, operators, decimal points, parentheses, and spaces
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
  return parseFloat(rounded.toFixed(10)).toLocaleString(undefined, {
    maximumFractionDigits: 10,
  });
}

function StandardCalc() {
  const [display, setDisplay] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const lastChar = display.slice(-1);
  const isOperator = (ch) => ['+', '−', '×', '÷'].includes(ch);

  const preview = (() => {
    if (display === '0' || display === '') return null;
    const result = evaluate(display);
    if (result === null) return null;
    const formatted = formatDisplay(result);
    // Don't show preview if it matches the display exactly
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

        case '⌫':
          setDisplay((prev) => {
            if (prev.length <= 1) return '0';
            return prev.slice(0, -1);
          });
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

        case '±':
          setDisplay((prev) => {
            if (prev === '0') return '0';
            if (prev.startsWith('-')) return prev.slice(1);
            return '-' + prev;
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
            // After evaluation, start fresh on digit/dot, or continue on operator
            if (justEvaluated) {
              if (isOp) {
                setJustEvaluated(false);
                return prev + ' ' + btn + ' ';
              }
              setJustEvaluated(false);
              return isDot ? '0.' : btn;
            }

            if (isOp) {
              // Replace trailing operator
              if (isOperator(prev.trim().slice(-1))) {
                return prev.trim().slice(0, -1) + btn + ' ';
              }
              return prev + ' ' + btn + ' ';
            }

            if (isDot) {
              // Find the last number segment and check for existing dot
              const parts = prev.split(/[+−×÷]/);
              const lastPart = parts[parts.length - 1];
              if (lastPart.includes('.')) return prev;
              if (prev === '0') return '0.';
              return prev + '.';
            }

            // Digit
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
    if (isOperator(btn) || btn === '÷')
      return [styles.calcBtn, styles.calcBtnOperator];
    if (btn === 'C' || btn === '⌫' || btn === '%' || btn === '±')
      return [styles.calcBtn, styles.calcBtnFunction];
    return [styles.calcBtn];
  };

  const getTextStyle = (btn) => {
    if (btn === '=') return [styles.calcBtnText, styles.calcBtnTextEquals];
    if (isOperator(btn) || btn === '÷')
      return [styles.calcBtnText, styles.calcBtnTextOperator];
    if (btn === 'C' || btn === '⌫' || btn === '%' || btn === '±')
      return [styles.calcBtnText, styles.calcBtnTextFunction];
    return [styles.calcBtnText];
  };

  return (
    <View style={[styles.card, { marginTop: 16 }]}>
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
                  btn === '⌫'
                    ? 'Backspace'
                    : btn === '±'
                      ? 'Toggle sign'
                      : btn === '×'
                        ? 'Multiply'
                        : btn === '÷'
                          ? 'Divide'
                          : btn === '−'
                            ? 'Subtract'
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
        <Text style={[styles.copyButton, copyFailed && { color: '#ef4444' }]}>
          {copied
            ? '\u2713 Copied!'
            : copyFailed
              ? 'Copy failed'
              : '\u2398 Copy result'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(StandardCalc);
