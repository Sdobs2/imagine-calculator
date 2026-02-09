import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';
import { useCryptoPrices } from './src/utils/useCryptoPrices';
import { calculators } from './src/utils/constants';
import createStyles from './src/styles';
import TabBar from './src/components/TabBar';
import CryptoPrices from './src/components/CryptoPrices';
import ImagineCalc from './src/components/ImagineCalc';
import TimeMachineCalc from './src/components/TimeMachineCalc';
import CalcCard from './src/components/CalcCard';
import InvestmentCalc from './src/components/InvestmentCalc';
import StandardCalc from './src/components/StandardCalc';
import QuickReference from './src/components/QuickReference';
import FaqSection from './src/components/FaqSection';

// Vercel Analytics — only runs on web
if (Platform.OS === 'web') {
  import('@vercel/analytics').then(({ inject }) => inject());
}

function AppContent() {
  const { theme, mode, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { prices, loading, error, lastUpdated, refresh } = useCryptoPrices();
  const [activeTab, setActiveTab] = useState('imagine');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTag}>Imagine</Text>
            <TouchableOpacity
              style={styles.themeToggle}
              onPress={toggleTheme}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            >
              <Text style={styles.themeToggleText}>
                {mode === 'light' ? '\u263E' : '\u2600'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>ImagineCalculator</Text>
          <Text style={styles.headerSub}>
            Dream big. See what your crypto investments could become with live
            prices, DCA scenarios, and what-if calculations.
          </Text>
        </View>

        {/* Tab bar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        {activeTab === 'imagine' ? (
          <>
            <CryptoPrices
              prices={prices}
              loading={loading}
              error={error}
              lastUpdated={lastUpdated}
              onRetry={refresh}
            />
            <ImagineCalc prices={prices} loading={loading} />
            <TimeMachineCalc prices={prices} />
          </>
        ) : (
          <>
            {calculators.map((c) => (
              <CalcCard key={c.id} type={c.id} />
            ))}
            <InvestmentCalc />
            <StandardCalc />
            <QuickReference />
            <FaqSection />
          </>
        )}

        {/* Footer */}
        <Text style={styles.footerHint}>
          Prices from CoinGecko · Not financial advice
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
