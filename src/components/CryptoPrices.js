import { useMemo, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { SUPPORTED_CRYPTOS } from '../utils/constants';
import createStyles from '../styles';

function formatPrice(price) {
  if (price >= 1) {
    return '$' + price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return '$' + price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

function formatChange(change) {
  if (change == null) return null;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function CryptoPrices({ prices, loading, error, lastUpdated, onRetry }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const timeAgo = useMemo(() => {
    if (!lastUpdated) return null;
    const seconds = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.round(seconds / 60)}m ago`;
  }, [lastUpdated]);

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={styles.cardLabel}>Live Prices</Text>
        {timeAgo && (
          <Text style={styles.lastUpdatedText}>Updated {timeAgo}</Text>
        )}
      </View>

      {loading && !prices && (
        <View style={styles.cryptoPriceRow}>
          {SUPPORTED_CRYPTOS.map((crypto) => (
            <View key={crypto.id} style={[styles.cryptoPriceCard, styles.skeleton, { height: 80 }]} />
          ))}
        </View>
      )}

      {prices && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cryptoPriceRow}
        >
          {SUPPORTED_CRYPTOS.map((crypto) => {
            const data = prices[crypto.id];
            if (!data) return null;
            const change = data.usd_24h_change;
            const isPositive = change >= 0;

            return (
              <View key={crypto.id} style={styles.cryptoPriceCard}>
                <Text style={styles.cryptoPriceSymbol}>{crypto.symbol}</Text>
                <Text style={styles.cryptoPriceValue}>
                  {formatPrice(data.usd)}
                </Text>
                {change != null && (
                  <Text
                    style={[
                      styles.cryptoPriceChange,
                      { color: isPositive ? theme.positive : theme.negative },
                    ]}
                  >
                    {isPositive ? '\u25B2' : '\u25BC'} {formatChange(change)}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Failed to load prices: {error}
          </Text>
          {onRetry && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRetry}
              activeOpacity={0.6}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default memo(CryptoPrices);
