import { memo } from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

const FAQS = [
  {
    q: 'How do I calculate percentage of a number?',
    a: 'Divide the percentage by 100 and multiply by the number. Example: 15% of 200 = (15/100) × 200 = 30.',
  },
  {
    q: 'How do I calculate percent change?',
    a: 'Use ((new − old) / |old|) × 100. A positive result is an increase; a negative result is a decrease.',
  },
  {
    q: 'How do I find what percent one number is of another?',
    a: 'Divide the part by the whole and multiply by 100. Example: 25 is what percent of 200? (25/200) × 100 = 12.5%.',
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
