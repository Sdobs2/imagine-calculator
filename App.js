/**
 * App.js — Root entry point for ImagineCalculator.
 *
 * Layout:
 *   1. Dark hero section (full-width) with value proposition
 *   2. Centered content wrapper (max 760px) with tabs
 *   3. Footer with attribution
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';
import { useCryptoPrices } from './src/utils/useCryptoPrices';
import { useResponsive } from './src/utils/useResponsive';
import { calculators, SUPPORTED_CRYPTOS } from './src/utils/constants';
import createStyles from './src/styles';
import TabBar from './src/components/TabBar';
import CryptoPrices from './src/components/CryptoPrices';
import ImagineCalc from './src/components/ImagineCalc';
import TimeMachineCalc from './src/components/TimeMachineCalc';
import CalcCard from './src/components/CalcCard';
import InvestmentCalc from './src/components/InvestmentCalc';
import StandardCalc from './src/components/StandardCalc';
import CompoundGrowthCalc from './src/components/CompoundGrowthCalc';
import QuickReference from './src/components/QuickReference';
import FaqSection from './src/components/FaqSection';

// Vercel Analytics — only runs on web
if (Platform.OS === 'web') {
  import('@vercel/analytics').then(({ inject }) => inject());
}

// ─── Price formatting helpers for hero ticker ────────────────────────────────

function formatTickerPrice(price) {
  if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(4);
}

// ─── Main App Content ────────────────────────────────────────────────────────

function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { prices, loading, error, lastUpdated, refresh } = useCryptoPrices();
  const { isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState('imagine');
  const scrollViewRef = useRef(null);
  const [calcSectionY, setCalcSectionY] = useState(0);
  const [isChartScrubbing, setIsChartScrubbing] = useState(false);

  // Smooth scroll from hero CTA to calculator section
  const scrollToCalculator = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: calcSectionY, animated: true });
  }, [calcSectionY]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.heroBg}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isChartScrubbing}
      >
        {/* ─── Hero Section (always dark, full-width) ──────────────────── */}
        <View style={styles.hero}>
          {/* Theme toggle */}
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <Text style={styles.themeToggleText}>
              {isDark ? '\u2600\uFE0F' : '\u263E'}
            </Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            {/* Tag line */}
            <Text style={styles.heroTag}>Imagine Calculator</Text>

            {/* Main headline */}
            <Text style={[styles.heroTitle, isDesktop && { fontSize: 48, lineHeight: 56 }]}>
              Imagine what your{'\n'}investments could become
            </Text>

            {/* Sub-headline */}
            <Text style={styles.heroSubtitle}>
              Crypto & stock growth · Compound · Percentage calculators
            </Text>

            {/* Primary CTA */}
            <TouchableOpacity
              style={styles.heroCta}
              onPress={scrollToCalculator}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Scroll to calculator"
            >
              <Text style={styles.heroCtaText}>Start Calculating →</Text>
            </TouchableOpacity>

            {/* Live crypto price mini-ticker */}
            {prices && (
              <View style={styles.heroTicker}>
                {SUPPORTED_CRYPTOS.map((crypto) => {
                  const data = prices[crypto.id];
                  if (!data) return null;
                  const change = data.usd_24h_change;
                  const isPositive = change != null && change >= 0;
                  return (
                    <View key={crypto.id} style={styles.heroTickerItem}>
                      <Text style={styles.heroTickerSymbol}>{crypto.symbol}</Text>
                      <Text style={styles.heroTickerPrice}>
                        {formatTickerPrice(data.usd)}
                      </Text>
                      {change != null && (
                        <Text
                          style={[
                            styles.heroTickerChange,
                            { color: isPositive ? '#34d399' : '#f87171' },
                          ]}
                        >
                          {isPositive ? '\u2191' : '\u2193'}
                          {Math.abs(change).toFixed(1)}%
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* ─── Main Content (centered, max 760px) ──────────────────────── */}
        <View
          style={styles.contentWrapper}
          onLayout={(e) => setCalcSectionY(e.nativeEvent.layout.y)}
        >
          {/* Tab navigation */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab content */}
          {activeTab === 'imagine' && (
            <>
              <CryptoPrices
                prices={prices}
                loading={loading}
                error={error}
                lastUpdated={lastUpdated}
                onRetry={refresh}
              />
              <ImagineCalc prices={prices} loading={loading} onScrubChange={setIsChartScrubbing} />
            </>
          )}

          {activeTab === 'timemachine' && (
            <TimeMachineCalc prices={prices} />
          )}

          {activeTab === 'growth' && (
            <CompoundGrowthCalc onScrubChange={setIsChartScrubbing} />
          )}

          {activeTab === 'tools' && (
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
          <Text style={styles.footerText}>
            Prices from CoinGecko · Not financial advice
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
