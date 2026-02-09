/**
 * FaqSection — Collapsible FAQ accordion.
 *
 * Features:
 *   - Tap to expand/collapse individual questions
 *   - Smooth LayoutAnimation for open/close transitions
 *   - Only one item open at a time for clean UX
 *   - Chevron indicator rotates to show state
 *   - Accessible with proper ARIA roles
 */

import { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQS = [
  {
    q: 'What is ImagineCalculator?',
    a: 'ImagineCalculator lets you dream about crypto and stock investments. Enter how much you want to invest, pick a crypto, set a target price, and see what your portfolio could become. It uses live prices from CoinGecko.',
  },
  {
    q: 'Are the crypto prices real-time?',
    a: 'Prices update every 60 seconds from the CoinGecko API. They reflect the current spot price in USD with 24-hour change data.',
  },
  {
    q: 'How does the DCA calculation work?',
    a: "The calculator assumes all monthly purchases happen at today's price for simplicity. It calculates: total coins = (initial investment + monthly amount \u00D7 months) / current price, then multiplies by your target price.",
  },
  {
    q: 'Is this financial advice?',
    a: 'No. ImagineCalculator is for entertainment and educational purposes only. Crypto and stock investments are volatile and risky. Always do your own research and consult a financial advisor.',
  },
  {
    q: 'How do I calculate percentage of a number?',
    a: 'Divide the percentage by 100 and multiply by the number. Example: 15% of 200 = (15/100) \u00D7 200 = 30.',
  },
  {
    q: 'How do I calculate percent change?',
    a: 'Use ((new \u2212 old) / |old|) \u00D7 100. A positive result is an increase; a negative result is a decrease.',
  },
  {
    q: 'How do I find what percent one number is of another?',
    a: 'Divide the part by the whole and multiply by 100. Example: 25 is what percent of 200? (25/200) \u00D7 100 = 12.5%.',
  },
  {
    q: 'How do stock returns relate to percentages?',
    a: 'A stock return is a percentage gain or loss. Multiply your investment by (1 + return/100) to estimate final value.',
  },
];

function FaqSection() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleItem = useCallback((index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>Frequently Asked Questions</Text>

      <View style={styles.faqList}>
        {FAQS.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityLabel={item.q}
                accessibilityHint={isExpanded ? 'Tap to collapse' : 'Tap to expand'}
              >
                <Text style={styles.faqQuestionText}>{item.q}</Text>
                <Text style={styles.faqArrow}>
                  {isExpanded ? '\u25B2' : '\u25BC'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default memo(FaqSection);
