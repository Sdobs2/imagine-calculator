import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

// ---------------------------------------------------------------------------
// Pure logic (unchanged from web version)
// ---------------------------------------------------------------------------

const calculators = [
  { id: 'whatIs', label: 'What is X% of Y?', emoji: '⚡' },
  { id: 'whatPercent', label: 'X is what % of Y?', emoji: '🔍' },
  { id: 'change', label: '% Change from X to Y', emoji: '📈' },
];

function calculate(type, a, b) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) return null;
  if (type === 'whatIs') return (numA / 100) * numB;
  if (type === 'whatPercent') return numB === 0 ? null : (numA / numB) * 100;
  if (type === 'change')
    return numA === 0 ? null : ((numB - numA) / Math.abs(numA)) * 100;
  return null;
}

function formatResult(val) {
  if (val === null) return '—';
  const rounded = Math.round(val * 1e10) / 1e10;
  if (Number.isInteger(rounded)) return rounded.toLocaleString();
  return parseFloat(rounded.toFixed(6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

// ---------------------------------------------------------------------------
// System font families (no async loading needed)
// ---------------------------------------------------------------------------

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const SANS = Platform.select({ ios: 'System', default: 'sans-serif' });

// ---------------------------------------------------------------------------
// CalcCard
// ---------------------------------------------------------------------------

function CalcCard({ type, emoji, label }) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);

  const result = calculate(type, a, b);
  const hasInput = a !== '' && b !== '';

  const placeholders = {
    whatIs: { a: 'Percentage', b: 'Number' },
    whatPercent: { a: 'Part', b: 'Whole' },
    change: { a: 'From', b: 'To' },
  };
  const p = placeholders[type];

  const operatorSymbol =
    type === 'change' ? '→' : type === 'whatPercent' ? '÷' : '×';

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

  const copyResult = async () => {
    const text = formatResult(result) + (type !== 'whatIs' ? '%' : '');
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{emoji}</Text>
        <Text style={styles.cardLabel}>{label}</Text>
      </View>

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
            placeholderTextColor="rgba(255,255,255,0.25)"
            keyboardType="decimal-pad"
            selectionColor="#f59e0b"
            style={[
              styles.input,
              focusedField === 'a' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('a')}
            onBlur={() => setFocusedField(null)}
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
            placeholderTextColor="rgba(255,255,255,0.25)"
            keyboardType="decimal-pad"
            selectionColor="#f59e0b"
            style={[
              styles.input,
              focusedField === 'b' && styles.inputFocused,
            ]}
            onFocus={() => setFocusedField('b')}
            onBlur={() => setFocusedField(null)}
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
          style={[
            styles.resultValue,
            hasInput && result !== null && styles.resultValueActive,
          ]}
        >
          {hasInput && result !== null
            ? `${formatResult(result)}${type !== 'whatIs' ? '%' : ''}`
            : '—'}
        </Text>
      </View>

      {/* Copy button */}
      {hasInput && result !== null && (
        <TouchableOpacity onPress={copyResult} activeOpacity={0.6}>
          <Text style={styles.copyButton}>
            {copied ? '✓ Copied!' : '⎘ Copy result'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// InvestmentCalc
// ---------------------------------------------------------------------------

function InvestmentCalc() {
  const [pctGain, setPctGain] = useState('');
  const [invested, setInvested] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [copied, setCopied] = useState(false);

  const pct = parseFloat(pctGain);
  const inv = parseFloat(invested);
  const hasInput =
    !isNaN(pct) && !isNaN(inv) && invested !== '' && pctGain !== '';
  const multiplier =
    !isNaN(pct) && pctGain !== '' ? 1 + pct / 100 : null;
  const finalValue = hasInput ? inv * (1 + pct / 100) : null;
  const profit = hasInput ? finalValue - inv : null;

  function getMultiplierLabel(m) {
    if (m === null || m <= 0) return null;
    if (Number.isInteger(m)) return `${m}x`;
    if (m >= 100) return `${Math.round(m)}x`;
    if (m >= 10) return `${Math.round(m * 10) / 10}x`;
    return `${Math.round(m * 100) / 100}x`;
  }

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

  const copyResult = async () => {
    const text = `${pctGain}% gain on $${parseFloat(invested).toLocaleString()} → $${finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${getMultiplierLabel(multiplier)}, +$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>💰</Text>
        <Text style={styles.cardLabel}>Stock Return Calculator</Text>
      </View>

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
              : '—'}
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
              : '—'}
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
              : '—'}
          </Text>
        </View>
      </View>

      {/* Copy */}
      {hasInput && (
        <TouchableOpacity onPress={copyResult} activeOpacity={0.6}>
          <Text style={styles.copyButton}>
            {copied ? '✓ Copied!' : '⎘ Copy result'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// QuickReference (table → View rows)
// ---------------------------------------------------------------------------

function QuickReference() {
  const data = [
    { pct: '10%', decimal: '0.10', fraction: '1/10', tip: 'Move decimal 1 left' },
    { pct: '15%', decimal: '0.15', fraction: '3/20', tip: '10% + half of 10%' },
    { pct: '20%', decimal: '0.20', fraction: '1/5', tip: 'Divide by 5' },
    { pct: '25%', decimal: '0.25', fraction: '1/4', tip: 'Divide by 4' },
    { pct: '33%', decimal: '0.33', fraction: '1/3', tip: 'Divide by 3' },
    { pct: '50%', decimal: '0.50', fraction: '1/2', tip: 'Divide by 2' },
    { pct: '75%', decimal: '0.75', fraction: '3/4', tip: 'Subtract 25%' },
  ];

  return (
    <View style={[styles.card, { marginTop: 16 }]}>
      <Text style={styles.cardLabel}>📋 Quick Reference</Text>

      {/* Table header */}
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <Text style={[styles.tableHeader, { flex: 1 }]}>%</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Dec</Text>
        <Text style={[styles.tableHeader, { flex: 1 }]}>Frac</Text>
        <Text style={[styles.tableHeader, { flex: 2 }]}>Shortcut</Text>
      </View>

      {/* Table rows */}
      {data.map((row) => (
        <View key={row.pct} style={styles.tableRow}>
          <Text style={[styles.tableCellHighlight, { flex: 1 }]}>
            {row.pct}
          </Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.decimal}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.fraction}</Text>
          <Text style={[styles.tableCellTip, { flex: 2 }]}>{row.tip}</Text>
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// App (root)
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0b" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTag}>Utility</Text>
            <Text style={styles.headerTitle}>% Calculator</Text>
            <Text style={styles.headerSub}>
              Three ways to calculate percentages. Results update live.
            </Text>
          </View>

          {/* Calculator cards */}
          {calculators.map((c) => (
            <CalcCard key={c.id} type={c.id} emoji={c.emoji} label={c.label} />
          ))}

          <InvestmentCalc />

          {/* Quick Reference */}
          <QuickReference />

          {/* Footer hint */}
          <Text style={styles.footerHint}>
            Tap fields to enter values · Results calculate instantly
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTag: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(245,158,11,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontFamily: MONO,
    marginTop: 8,
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardLabel: {
    fontFamily: MONO,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Description
  descContainer: {
    marginBottom: 16,
  },
  descText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },
  descHighlight: {
    color: '#f59e0b',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 18,
    fontFamily: MONO,
  },
  inputFocused: {
    borderColor: 'rgba(245,158,11,0.5)',
  },
  inputSuffix: {
    position: 'absolute',
    right: 14,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: MONO,
    fontSize: 16,
  },
  inputPrefix: {
    position: 'absolute',
    left: 14,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: MONO,
    fontSize: 16,
    zIndex: 1,
  },
  operator: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontFamily: MONO,
  },

  // Result box
  resultBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  resultBoxActive: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  resultLabel: {
    fontFamily: MONO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  resultValue: {
    fontFamily: MONO,
    fontWeight: '700',
    fontSize: 18,
    color: 'rgba(255,255,255,0.15)',
  },
  resultValueActive: {
    fontSize: 24,
    color: '#f59e0b',
  },

  // Copy button
  copyButton: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    fontFamily: MONO,
    letterSpacing: 0.5,
  },

  // Investment result row
  investResultRow: {
    flexDirection: 'row',
    gap: 8,
  },
  investResultCard: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  investResultLabel: {
    fontFamily: MONO,
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  investResultValue: {
    fontFamily: MONO,
    fontWeight: '700',
  },
  multiplierBadge: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  multiplierText: {
    fontFamily: MONO,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // Quick reference table
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginTop: 14,
    marginBottom: 2,
  },
  tableHeader: {
    fontFamily: MONO,
    fontWeight: '500',
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tableCellHighlight: {
    fontFamily: MONO,
    fontWeight: '600',
    fontSize: 14,
    color: '#f59e0b',
  },
  tableCell: {
    fontFamily: MONO,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  tableCellTip: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },

  // Footer
  footerHint: {
    textAlign: 'center',
    marginTop: 24,
    color: 'rgba(255,255,255,0.15)',
    fontSize: 12,
    fontFamily: MONO,
  },
});
