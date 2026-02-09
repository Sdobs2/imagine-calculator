/**
 * CompoundGrowthCalc — Long-term compound interest + DCA growth calculator.
 *
 * Features:
 *   - Initial investment input (default $1,000 — baby bond scenario)
 *   - Monthly contribution input
 *   - Annual return presets (6%, 8%, 10% S&P avg, 12%) + manual entry
 *   - Time horizon presets (18yr, 25yr, 30yr, 40yr, 50yr) + manual entry
 *   - Interactive growth chart with scrubber (reuses GrowthChart)
 *   - Result cards: Total Contributed, Interest Earned, Final Value, Multiplier
 *   - Dynamic descriptive sentence
 *   - Copy result to clipboard
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../utils/ThemeContext';
import {
  calculateCompoundGrowth,
  generateCompoundChartData,
  formatUSD,
} from '../utils/imaginecalc';
import createStyles from '../styles';
import GrowthChart from './GrowthChart';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMultiplierLabel(m) {
  if (m <= 0) return '0x';
  if (Number.isInteger(m)) return `${m}x`;
  if (m >= 100) return `${Math.round(m)}x`;
  if (m >= 10) return `${Math.round(m * 10) / 10}x`;
  return `${Math.round(m * 100) / 100}x`;
}

const RETURN_PRESETS = [
  { label: '6%', sublabel: 'Conservative', value: 6 },
  { label: '8%', sublabel: 'Moderate', value: 8 },
  { label: '10%', sublabel: 'S&P 500 Avg', value: 10 },
  { label: '12%', sublabel: 'Aggressive', value: 12 },
];

const YEARS_PRESETS = [
  { label: '18yr', value: 18 },
  { label: '25yr', value: 25 },
  { label: '30yr', value: 30 },
  { label: '40yr', value: 40 },
  { label: '50yr', value: 50 },
];

// ─── Component ──────────────────────────────────────────────────────────────

function CompoundGrowthCalc() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chartWidth, setChartWidth] = useState(300);

  const [initialInvestment, setInitialInvestment] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [annualReturn, setAnnualReturn] = useState('10');
  const [years, setYears] = useState('30');
  const [selectedReturnPreset, setSelectedReturnPreset] = useState(10);
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleReturnPresetPress = useCallback((value) => {
    setSelectedReturnPreset(value);
    setAnnualReturn(String(value));
  }, []);

  const handleReturnChange = useCallback((text) => {
    setAnnualReturn(text);
    setSelectedReturnPreset(null);
  }, []);

  const handleYearsPresetPress = useCallback((value) => {
    setYears(String(value));
  }, []);

  // ─── Calculation ──────────────────────────────────────────────────────────

  const result = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn);
    const y = parseFloat(years);
    if ((init <= 0 && monthly <= 0) || isNaN(rate) || isNaN(y) || y <= 0) return null;
    return calculateCompoundGrowth(init, monthly, rate / 100, y);
  }, [initialInvestment, monthlyContribution, annualReturn, years]);

  const hasResult = result !== null;
  const isGain = hasResult && result.interestEarned >= 0;

  // Chart data
  const chartData = useMemo(() => {
    const init = parseFloat(initialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn);
    const y = parseFloat(years);
    if ((init <= 0 && monthly <= 0) || isNaN(rate) || isNaN(y) || y <= 0) return null;
    return generateCompoundChartData(init, monthly, rate / 100, y);
  }, [initialInvestment, monthlyContribution, annualReturn, years]);

  // Target date for hint
  const targetDate = useMemo(() => {
    const y = parseFloat(years);
    if (isNaN(y) || y <= 0) return null;
    const d = new Date();
    d.setFullYear(d.getFullYear() + Math.round(y));
    return d.getFullYear();
  }, [years]);

  // ─── Copy ─────────────────────────────────────────────────────────────────

  const copyResult = useCallback(async () => {
    if (!result) return;
    const text = `Compound Growth: $${formatUSD(result.totalContributed)} invested at ${annualReturn}%/yr for ${years} years → $${formatUSD(result.finalValue)} (${getMultiplierLabel(result.multiplier)}, +$${formatUSD(result.interestEarned)} in growth)`;
    try {
      await Clipboard.setStringAsync(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 1500);
    }
  }, [result, annualReturn, years]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      {/* Card header */}
      <Text style={styles.cardLabel}>Compound Growth</Text>

      {/* Dynamic descriptive sentence */}
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          Invest{' '}
          <Text style={styles.descHighlight}>${initialInvestment || '0'}</Text>
          {monthlyContribution && parseFloat(monthlyContribution) > 0 ? (
            <>
              , add <Text style={styles.descHighlight}>${monthlyContribution}</Text>/mo
            </>
          ) : null}
          , earn{' '}
          <Text style={styles.descHighlight}>{annualReturn || '0'}%</Text>/yr for{' '}
          <Text style={styles.descHighlight}>{years || '0'}</Text> years
          {hasResult ? (
            <>
              {' '}→ <Text style={[styles.descHighlight, { color: theme.positive }]}>
                ${formatUSD(result.finalValue)}
              </Text>
            </>
          ) : '...'}
        </Text>
      </View>

      {/* ─── Initial Investment ─────────────────────────────────────── */}
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
            accessibilityHint="One-time lump sum to start"
          />
        </View>
        <Text style={styles.inputHelperText}>One-time lump sum to start</Text>
      </View>

      {/* ─── Monthly Contribution ───────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Monthly Contribution</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            placeholder="100"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, { paddingLeft: 28 }, focusedField === 'monthly' && styles.inputFocused]}
            onFocus={() => setFocusedField('monthly')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Monthly contribution amount"
            accessibilityHint="Amount added every month"
          />
        </View>
        <Text style={styles.inputHelperText}>Recurring monthly deposit — set to 0 for lump sum only</Text>
      </View>

      {/* ─── Annual Return ──────────────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Annual Return</Text>
        <View style={styles.chipRow}>
          {RETURN_PRESETS.map((preset) => {
            const isSelected = selectedReturnPreset === preset.value;
            return (
              <TouchableOpacity
                key={preset.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleReturnPresetPress(preset.value)}
                activeOpacity={0.6}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${preset.label} ${preset.sublabel}`}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            value={annualReturn}
            onChangeText={handleReturnChange}
            placeholder="10"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={theme.accent}
            style={[styles.input, focusedField === 'rate' && styles.inputFocused]}
            onFocus={() => setFocusedField('rate')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Annual return percentage"
            accessibilityHint="Expected annual return rate"
          />
          {annualReturn !== '' && <Text style={styles.inputSuffix}>%</Text>}
        </View>
        {selectedReturnPreset && (
          <Text style={styles.inputHelperText}>
            {RETURN_PRESETS.find((p) => p.value === selectedReturnPreset)?.sublabel} — historical average
          </Text>
        )}
      </View>

      {/* ─── Time Horizon ───────────────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Time Horizon</Text>
        <View style={styles.chipRow}>
          {YEARS_PRESETS.map((preset) => {
            const isSelected = parseInt(years) === preset.value;
            return (
              <TouchableOpacity
                key={preset.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleYearsPresetPress(preset.value)}
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
        <View style={styles.inputWrapper}>
          <TextInput
            value={years}
            onChangeText={setYears}
            placeholder="30"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="number-pad"
            selectionColor={theme.accent}
            style={[styles.input, focusedField === 'years' && styles.inputFocused]}
            onFocus={() => setFocusedField('years')}
            onBlur={() => setFocusedField(null)}
            accessibilityLabel="Investment time horizon in years"
            accessibilityHint="How many years you plan to invest"
          />
          {years !== '' && <Text style={styles.inputSuffix}>yr</Text>}
        </View>
        {targetDate && (
          <Text style={styles.inputHelperText}>That's the year {targetDate}</Text>
        )}
      </View>

      {/* ─── Growth Chart ────────────────────────────────────────────── */}
      {chartData && chartData.length >= 2 && (
        <View
          style={styles.chartContainer}
          onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - 32)}
        >
          <Text style={styles.chartTitle}>Compound Growth Projection</Text>
          <GrowthChart
            data={chartData}
            theme={theme}
            width={chartWidth}
            valueLabel="Balance"
            investedLabel="Contributions"
          />
        </View>
      )}

      {/* ─── Results Grid ────────────────────────────────────────────── */}
      {hasResult && (
        <>
          <View style={styles.resultsGrid}>
            <View style={[styles.resultGridItem, { backgroundColor: theme.surfaceHover, borderColor: theme.surfaceBorder }]}>
              <Text style={styles.investResultLabel}>Total Contributed</Text>
              <Text
                style={[styles.investResultValue, { color: theme.textSecondary, fontSize: 16 }]}
                accessibilityLabel={`Total contributed: $${formatUSD(result.totalContributed)}`}
              >
                ${formatUSD(result.totalContributed)}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: isGain ? theme.positiveBg : theme.negativeBg, borderColor: isGain ? theme.positiveBorder : theme.negativeBorder }]}>
              <Text style={styles.investResultLabel}>Interest Earned</Text>
              <Text
                style={[styles.investResultValue, { color: isGain ? theme.positive : theme.negative, fontSize: 18 }]}
                accessibilityLiveRegion="polite"
              >
                {result.interestEarned >= 0 ? '+' : ''}${formatUSD(Math.abs(result.interestEarned))}
              </Text>
            </View>

            <View style={[styles.resultGridItem, { backgroundColor: theme.accentBg, borderColor: theme.accentBorder }]}>
              <Text style={styles.investResultLabel}>Final Value</Text>
              <Text
                style={[styles.investResultValue, { color: theme.accent, fontSize: 20 }]}
                accessibilityLiveRegion="polite"
              >
                ${formatUSD(result.finalValue)}
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
        <Text style={styles.hintText}>Enter values above to see compound growth</Text>
      )}

      <Text style={styles.disclaimerText}>
        Based on fixed annual returns compounded monthly. Actual returns vary. Not financial advice.
      </Text>
    </View>
  );
}

export default memo(CompoundGrowthCalc);
