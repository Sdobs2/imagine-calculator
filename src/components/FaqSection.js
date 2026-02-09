import { useMemo, memo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import createStyles from '../styles';

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
    a: "The calculator assumes all monthly purchases happen at today's price for simplicity. It calculates: total coins = (initial investment + monthly amount x months) / current price, then multiplies by your target price.",
  },
  {
    q: 'Is this financial advice?',
    a: 'No. ImagineCalculator is for entertainment and educational purposes only. Crypto and stock investments are volatile and risky. Always do your own research and consult a financial advisor.',
  },
  {
    q: 'How do I calculate percentage of a number?',
    a: 'Divide the percentage by 100 and multiply by the number. Example: 15% of 200 = (15/100) x 200 = 30.',
  },
  {
    q: 'How do I calculate percent change?',
    a: 'Use ((new - old) / |old|) x 100. A positive result is an increase; a negative result is a decrease.',
  },
  {
    q: 'How do I find what percent one number is of another?',
    a: 'Divide the part by the whole and multiply by 100. Example: 25 is what percent of 200? (25/200) x 100 = 12.5%.',
  },
  {
    q: 'How do I calculate percent increase or decrease?',
    a: 'Use percent change. If the result is positive it is an increase; if negative it is a decrease.',
  },
  {
    q: 'How do stock returns relate to percentages?',
    a: 'A stock return is a percentage gain or loss. Multiply your investment by (1 + return/100) to estimate final value.',
  },
];

function FaqSection() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, { marginTop: 16 }]}>
      <Text style={styles.cardLabel}>FAQ</Text>
      <View style={styles.faqList}>
        {FAQS.map((item) => (
          <View key={item.q} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{item.q}</Text>
            <Text style={styles.faqAnswer}>{item.a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(FaqSection);
