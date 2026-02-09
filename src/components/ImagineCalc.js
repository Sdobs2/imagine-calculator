import { useState, useMemo, useCallback, memo } from 'react';
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

function ImagineCalc({ prices, loading }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyDCA, setMonthlyDCA] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [months, setMonths] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const crypto = SUPPORTED_CRYPTOS.find((c) => c.id === selectedCrypto);
  const currentPrice = prices?.[selectedCrypto]?.usd ?? 0;

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

      <View style={styles.inputRow}>
        <View style={[styles.inputWrapper, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Target Price</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={targetPrice}
              onChangeText={setTargetPrice}
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
        </View>

        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.inputLabel}>Months</Text>
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
        </View>
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
