/**
 * TabBar — Segmented control for switching between app sections.
 *
 * Two tabs:
 *   1. "Imagine" — DCA scenarios, time machine, live prices
 *   2. "Calculators" — Percentage calculators, investment return, standard calc
 */

import { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const TABS = [
  { id: 'imagine', label: 'Imagine' },
  { id: 'growth', label: 'Growth' },
  { id: 'tools', label: 'Calculators' },
];

function TabBar({ activeTab, onTabChange }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.tabBar} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <Text
              style={[
                styles.tabButtonText,
                isActive && styles.tabButtonTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default memo(TabBar);
