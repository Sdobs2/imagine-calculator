import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CalcCard from './src/components/CalcCard';
import InvestmentCalc from './src/components/InvestmentCalc';
import QuickReference from './src/components/QuickReference';
import { calculators } from './src/utils/constants';
import styles from './src/styles';

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
