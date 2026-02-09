/**
 * GrowthChart — Animated SVG area chart with interactive scrubber.
 *
 * Renders two overlapping areas:
 *   1. Portfolio Value (accent color, solid line + gradient fill)
 *   2. Total Invested (muted, dashed line + subtle fill)
 *
 * Interactive scrubber (Apple Stocks-style):
 *   - Touch/drag along the chart to see values at any point in time
 *   - Vertical indicator line with dots on both curves
 *   - Floating tooltip with month, portfolio value, invested, and profit
 *   - Smooth interpolation between data points
 */

import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { FONTS } from '../utils/theme';

const CHART_HEIGHT = 200;
const PADDING = { top: 28, right: 20, bottom: 36, left: 20 };

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCompact(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

function formatUSD(value) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatMonth(month) {
  if (month === 0) return 'Now';
  if (month >= 12) {
    const years = month / 12;
    if (Number.isInteger(years)) return `${years}yr`;
    return `${years.toFixed(1)}yr`;
  }
  return `${Math.round(month)}mo`;
}

// ─── Seeded PRNG (matches imaginecalc.js for consistency) ───────────────────

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(init, monthly, current, target, months) {
  return Math.round((init * 7 + monthly * 13 + current * 31 + target * 37 + months * 41) * 100);
}

function gaussianRandom(rng) {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Generates monthly data points for the DCA growth projection.
 * Supports three price models: bestCase, linear, volatile.
 */
function generateChartData(initialInvestment, monthlyDCA, currentPrice, targetPrice, months, model = 'bestCase') {
  if (months <= 0 || currentPrice <= 0) return [];

  const MONTHLY_VOL = 0.15;
  const rng = model === 'volatile'
    ? mulberry32(hashSeed(initialInvestment, monthlyDCA, currentPrice, targetPrice, months))
    : null;

  // For chart, compute every month for accuracy, then sample points
  // First, compute month-by-month coin accumulation
  const monthlyData = [];
  let totalCoins = initialInvestment / currentPrice;

  for (let m = 0; m <= months; m++) {
    const totalInvested = initialInvestment + monthlyDCA * m;

    // Price at this month for portfolio valuation
    let priceAtMonth = currentPrice + (targetPrice - currentPrice) * (m / months);

    if (model === 'volatile' && rng && m > 0) {
      const noise = MONTHLY_VOL * gaussianRandom(rng);
      priceAtMonth = priceAtMonth * (1 + noise);
      priceAtMonth = Math.max(priceAtMonth, currentPrice * 0.01);
    }

    // For bestCase, all coins bought at today's price
    let portfolioValue;
    if (model === 'bestCase') {
      const bestCaseCoins = initialInvestment / currentPrice + (monthlyDCA * m) / currentPrice;
      portfolioValue = bestCaseCoins * priceAtMonth;
    } else {
      portfolioValue = totalCoins * priceAtMonth;
    }

    monthlyData.push({ month: m, invested: totalInvested, value: portfolioValue });

    // Buy coins for next month at this month's price (for linear/volatile)
    if (m < months && model !== 'bestCase' && priceAtMonth > 0 && monthlyDCA > 0) {
      totalCoins += monthlyDCA / priceAtMonth;
    }
  }

  // Sample down to ~36 points for smooth rendering
  const numPoints = Math.min(Math.max(months + 1, 3), 37);
  if (monthlyData.length <= numPoints) return monthlyData;

  const step = months / (numPoints - 1);
  const data = [];
  for (let i = 0; i < numPoints; i++) {
    const targetMonth = Math.min(Math.round(i * step), months);
    data.push(monthlyData[targetMonth]);
  }
  return data;
}

/**
 * Interpolates between data points to find values at an arbitrary month.
 */
function interpolateAtMonth(data, month) {
  if (!data.length) return null;
  if (month <= data[0].month) return { ...data[0] };
  if (month >= data[data.length - 1].month) return { ...data[data.length - 1] };

  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].month <= month && data[i + 1].month >= month) {
      const range = data[i + 1].month - data[i].month;
      const t = range > 0 ? (month - data[i].month) / range : 0;
      return {
        month,
        value: data[i].value + (data[i + 1].value - data[i].value) * t,
        invested: data[i].invested + (data[i + 1].invested - data[i].invested) * t,
      };
    }
  }
  return { ...data[data.length - 1] };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function GrowthChart({
  initialInvestment,
  monthlyDCA,
  currentPrice,
  targetPrice,
  months,
  model = 'bestCase',
  data: externalData,
  theme,
  width: containerWidth,
  valueLabel = 'Portfolio Value',
  investedLabel = 'Total Invested',
  onScrubChange,
}) {
  const width = containerWidth || 300;
  const height = CHART_HEIGHT;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chartRef = useRef(null);
  const layoutRef = useRef({ x: 0, y: 0, width: 0 });

  // Scrubber state: null when not scrubbing, 0-1 fraction when active
  const [scrubFraction, setScrubFraction] = useState(null);
  const isScrubbing = scrubFraction !== null;

  // Use externally provided data if available, otherwise generate from crypto params
  const generatedData = useMemo(
    () => externalData ? [] : generateChartData(initialInvestment, monthlyDCA, currentPrice, targetPrice, months, model),
    [externalData, initialInvestment, monthlyDCA, currentPrice, targetPrice, months, model],
  );
  const data = externalData || generatedData;

  // Derive months from data when using external data
  const effectiveMonths = externalData
    ? (data.length > 0 ? data[data.length - 1].month : 0)
    : months;

  // Fade in when data changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [data, fadeAnim]);

  if (data.length < 2) return null;

  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  // Compute scales
  const allValues = data.flatMap((d) => [d.invested, d.value]);
  const maxValue = Math.max(...allValues) * 1.1; // 10% headroom
  const maxMonth = data[data.length - 1].month || 1;

  const xScale = (month) => PADDING.left + (month / maxMonth) * chartW;
  const yScale = (value) => PADDING.top + chartH - (value / maxValue) * chartH;
  const baseY = PADDING.top + chartH;

  // Generate SVG path strings
  const valueLine = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.month).toFixed(1)},${yScale(d.value).toFixed(1)}`)
    .join(' ');

  const investedLine = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.month).toFixed(1)},${yScale(d.invested).toFixed(1)}`)
    .join(' ');

  // Closed area paths
  const lastX = xScale(maxMonth).toFixed(1);
  const firstX = xScale(0).toFixed(1);
  const baseYStr = baseY.toFixed(1);
  const valueArea = `${valueLine} L${lastX},${baseYStr} L${firstX},${baseYStr} Z`;
  const investedArea = `${investedLine} L${lastX},${baseYStr} L${firstX},${baseYStr} Z`;

  const lastPoint = data[data.length - 1];
  const endX = xScale(maxMonth);
  const endValueY = yScale(lastPoint.value);
  const endInvestedY = yScale(lastPoint.invested);

  // Avoid overlapping labels — offset if too close
  const labelGap = Math.abs(endValueY - endInvestedY);
  const valueLabelY = labelGap < 20 ? endValueY - 14 : endValueY - 10;
  const investedLabelY = labelGap < 20 ? endInvestedY + 14 : endInvestedY + 14;

  // ─── Scrubber calculations ──────────────────────────────────────────────

  const scrubData = useMemo(() => {
    if (scrubFraction === null) return null;
    const month = scrubFraction * maxMonth;
    return interpolateAtMonth(data, month);
  }, [scrubFraction, data, maxMonth]);

  const scrubX = scrubFraction !== null ? PADDING.left + scrubFraction * chartW : 0;
  const scrubValueY = scrubData ? yScale(scrubData.value) : 0;
  const scrubInvestedY = scrubData ? yScale(scrubData.invested) : 0;
  const scrubProfit = scrubData ? scrubData.value - scrubData.invested : 0;
  const scrubIsGain = scrubProfit >= 0;

  // ─── Touch / pointer handlers ───────────────────────────────────────────

  const getFractionFromEvent = useCallback((evt) => {
    const locationX = evt.nativeEvent.locationX ?? evt.nativeEvent.offsetX ?? 0;
    const fraction = (locationX - PADDING.left) / chartW;
    return Math.max(0, Math.min(1, fraction));
  }, [chartW]);

  const handleTouchStart = useCallback((evt) => {
    setScrubFraction(getFractionFromEvent(evt));
    onScrubChange?.(true);
  }, [getFractionFromEvent, onScrubChange]);

  const handleTouchMove = useCallback((evt) => {
    setScrubFraction(getFractionFromEvent(evt));
  }, [getFractionFromEvent]);

  const handleTouchEnd = useCallback(() => {
    setScrubFraction(null);
    onScrubChange?.(false);
  }, [onScrubChange]);

  // ─── Tooltip position — trails behind the scrub dot ─────────────────────

  const tooltipWidth = 160;
  const tooltipOffset = 20; // gap between dot and tooltip edge
  // Position tooltip to the left of the dot; flip to right when near left edge
  const tooltipLeft = scrubX > tooltipWidth + tooltipOffset + PADDING.left
    ? Math.max(0, scrubX - tooltipWidth - tooltipOffset)
    : Math.min(scrubX + tooltipOffset, width - tooltipWidth);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Scrubber tooltip — floats above chart */}
      {isScrubbing && scrubData && (
        <View
          style={{
            position: 'absolute',
            top: -6,
            left: tooltipLeft,
            width: tooltipWidth,
            zIndex: 10,
            backgroundColor: theme.surface === '#ffffff' ? '#1e293b' : 'rgba(255,255,255,0.12)',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: theme.surface === '#ffffff' ? '#334155' : 'rgba(255,255,255,0.18)',
            ...Platform.select({
              web: {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              },
              default: {},
            }),
          }}
          pointerEvents="none"
        >
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              fontWeight: '600',
              color: theme.surface === '#ffffff' ? '#94a3b8' : theme.textMuted,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            {formatMonth(scrubData.month)}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.surface === '#ffffff' ? '#cbd5e1' : theme.textMuted }}>
              {valueLabel.length > 10 ? 'Value' : valueLabel}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: '700', color: theme.chartLine }}>
              ${formatUSD(scrubData.value)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.surface === '#ffffff' ? '#cbd5e1' : theme.textMuted }}>
              {investedLabel.length > 10 ? 'Invested' : investedLabel}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: '600', color: theme.surface === '#ffffff' ? '#94a3b8' : theme.chartInvested }}>
              ${formatUSD(scrubData.invested)}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: theme.surface === '#ffffff' ? '#334155' : 'rgba(255,255,255,0.1)', marginVertical: 3 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.surface === '#ffffff' ? '#cbd5e1' : theme.textMuted }}>
              Profit
            </Text>
            <Text style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              fontWeight: '700',
              color: scrubIsGain ? theme.positive : theme.negative,
            }}>
              {scrubIsGain ? '+' : ''}${formatUSD(scrubProfit)}
            </Text>
          </View>
        </View>
      )}

      {/* Chart with touch overlay — aggressive capture prevents ScrollView stealing gesture */}
      <View
        ref={chartRef}
        style={{ position: 'relative', cursor: isScrubbing ? 'grabbing' : 'crosshair' }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderGrant={handleTouchStart}
        onResponderMove={handleTouchMove}
        onResponderRelease={handleTouchEnd}
        onResponderTerminate={handleTouchEnd}
      >
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={theme.chartLine} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={theme.chartLine} stopOpacity="0.02" />
            </LinearGradient>
            <LinearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={theme.chartInvested} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={theme.chartInvested} stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {/* Baseline grid */}
          <Line
            x1={PADDING.left} y1={baseY}
            x2={width - PADDING.right} y2={baseY}
            stroke={theme.chartGrid} strokeWidth="1"
          />
          <Line
            x1={PADDING.left} y1={PADDING.top}
            x2={width - PADDING.right} y2={PADDING.top}
            stroke={theme.chartGrid} strokeWidth="0.5" opacity="0.4"
          />

          {/* Portfolio value area + line (rendered first = behind) */}
          <Path d={valueArea} fill="url(#valueGradient)" />
          <Path
            d={valueLine}
            stroke={theme.chartLine}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Invested area + line (rendered second = in front) */}
          <Path d={investedArea} fill="url(#investedGradient)" />
          <Path
            d={investedLine}
            stroke={theme.chartInvested}
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6,4"
          />

          {/* ─── Scrubber elements (when active) ──────────────────────── */}
          {isScrubbing && scrubData && (
            <>
              {/* Vertical scrubber line */}
              <Line
                x1={scrubX}
                y1={PADDING.top}
                x2={scrubX}
                y2={baseY}
                stroke={theme.chartLine}
                strokeWidth="1"
                strokeDasharray="4,3"
                opacity="0.6"
              />

              {/* Dot on portfolio value (yellow) line — prominent glow + solid dot */}
              <Circle cx={scrubX} cy={scrubValueY} r="10" fill={theme.chartLine} opacity="0.12" />
              <Circle cx={scrubX} cy={scrubValueY} r="6" fill={theme.chartLine} opacity="0.25" />
              <Circle cx={scrubX} cy={scrubValueY} r="4.5" fill={theme.chartLine} />
              <Circle
                cx={scrubX}
                cy={scrubValueY}
                r="2"
                fill="#ffffff"
                opacity="0.6"
              />

              {/* Dot on invested (grey) line */}
              <Circle cx={scrubX} cy={scrubInvestedY} r="5" fill={theme.chartInvested} opacity="0.2" />
              <Circle cx={scrubX} cy={scrubInvestedY} r="3" fill={theme.chartInvested} />
            </>
          )}

          {/* ─── Default end point elements (when NOT scrubbing) ──────── */}
          {!isScrubbing && (
            <>
              {/* End point dots */}
              <Circle cx={endX} cy={endValueY} r="5" fill={theme.chartLine} />
              <Circle cx={endX} cy={endValueY} r="2.5" fill={theme.heroBg === '#0f172a' ? '#ffffff' : '#0f172a'} opacity="0.4" />
              <Circle cx={endX} cy={endInvestedY} r="3.5" fill={theme.chartInvested} />

              {/* End value labels */}
              <SvgText
                x={endX - 10}
                y={valueLabelY}
                fill={theme.chartLine}
                fontSize="11"
                fontWeight="700"
                fontFamily={FONTS.mono}
                textAnchor="end"
              >
                {formatCompact(lastPoint.value)}
              </SvgText>
              <SvgText
                x={endX - 8}
                y={investedLabelY}
                fill={theme.chartInvested}
                fontSize="10"
                fontWeight="600"
                fontFamily={FONTS.mono}
                textAnchor="end"
              >
                {formatCompact(lastPoint.invested)}
              </SvgText>
            </>
          )}

          {/* X-axis labels */}
          <SvgText
            x={PADDING.left}
            y={height - 10}
            fill={theme.chartLabel}
            fontSize="10"
            fontFamily={FONTS.mono}
          >
            Now
          </SvgText>
          <SvgText
            x={width - PADDING.right}
            y={height - 10}
            fill={theme.chartLabel}
            fontSize="10"
            fontFamily={FONTS.mono}
            textAnchor="end"
          >
            {effectiveMonths >= 12 ? `${Math.round(effectiveMonths / 12)}yr` : `${effectiveMonths}mo`}
          </SvgText>

          {/* Scrubber month label on X-axis */}
          {isScrubbing && scrubData && (
            <SvgText
              x={scrubX}
              y={height - 10}
              fill={theme.chartLine}
              fontSize="10"
              fontWeight="700"
              fontFamily={FONTS.mono}
              textAnchor="middle"
            >
              {formatMonth(scrubData.month)}
            </SvgText>
          )}
        </Svg>
      </View>

      {/* Scrub hint (shown when not scrubbing) */}
      {!isScrubbing && (
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: theme.textMuted,
            textAlign: 'center',
            marginTop: 4,
            opacity: 0.7,
          }}
        >
          Touch & drag to explore timeline
        </Text>
      )}

      {/* Legend below chart */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 14, height: 3, backgroundColor: theme.chartLine, borderRadius: 2 }} />
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: theme.textSecondary }}>
            {valueLabel}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 14, height: 2, backgroundColor: theme.chartInvested, borderRadius: 1 }} />
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: theme.textMuted }}>
            {investedLabel}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
