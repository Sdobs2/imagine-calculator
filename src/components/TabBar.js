import { useMemo, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

const TABS = [
  { id: 'tools', label: 'Percentage Calculators' },
  { id: 'imagine', label: 'Imagine' },
];

function TabBar({ activeTab, onTabChange }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.6}
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
