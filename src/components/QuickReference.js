/**
 * QuickReference — Percentage reference table.
 *
 * Displays common percentages with their decimal, fraction equivalents
 * and mental math shortcuts. Clean table layout with accent highlighting.
 */

import { useMemo, memo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const data = [
  { pct: '10%', decimal: '0.10', fraction: '1/10', tip: 'Move decimal 1 left' },
  { pct: '15%', decimal: '0.15', fraction: '3/20', tip: '10% + half of 10%' },
  { pct: '20%', decimal: '0.20', fraction: '1/5', tip: 'Divide by 5' },
  { pct: '25%', decimal: '0.25', fraction: '1/4', tip: 'Divide by 4' },
  { pct: '33%', decimal: '0.33', fraction: '1/3', tip: 'Divide by 3' },
  { pct: '50%', decimal: '0.50', fraction: '1/2', tip: 'Divide by 2' },
  { pct: '75%', decimal: '0.75', fraction: '3/4', tip: 'Subtract 25%' },
];

function QuickReference() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Quick Reference</Text>

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
          <Text style={[styles.tableCellHighlight, { flex: 1 }]}>{row.pct}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.decimal}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{row.fraction}</Text>
          <Text style={[styles.tableCellTip, { flex: 2 }]}>{row.tip}</Text>
        </View>
      ))}
    </View>
  );
}

export default memo(QuickReference);
