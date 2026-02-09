/**
 * Centralized StyleSheet factory — ImagineCalculator
 *
 * All component styles are defined here, themed via the `theme` parameter.
 * Design tokens (FONTS, SPACING, RADIUS, SHADOWS) come from theme.js.
 */

import { StyleSheet, Platform } from 'react-native';
import { FONTS, SPACING, RADIUS, SHADOWS } from './utils/theme';

export default function createStyles(theme) {
  return StyleSheet.create({
    // ─── Layout ──────────────────────────────────────────────────────────────

    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    // Content wrapper — centered with max-width, reliable on web and native
    contentWrapper: {
      maxWidth: 760,
      width: '100%',
      alignSelf: 'center',
      paddingHorizontal: 20,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING['2xl'],
    },

    // ─── Hero Section ────────────────────────────────────────────────────────
    // Dark hero in both modes for dramatic contrast

    hero: {
      backgroundColor: theme.heroBg,
      paddingTop: SPACING['3xl'],
      paddingBottom: SPACING['2xl'],
      position: 'relative',
      overflow: 'hidden',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    heroContent: {
      alignItems: 'center',
      width: '100%',
      maxWidth: 760,
      paddingHorizontal: 20,
      zIndex: 1,
    },
    heroTag: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '600',
      color: theme.heroAccent,
      letterSpacing: 4,
      textTransform: 'uppercase',
      marginBottom: SPACING.md,
    },
    heroTitle: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.heroText,
      textAlign: 'center',
      letterSpacing: -1,
      lineHeight: 44,
      marginBottom: SPACING.md,
    },
    heroSubtitle: {
      fontFamily: FONTS.mono,
      fontSize: 14,
      color: theme.heroTextSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: SPACING.xl,
    },
    heroCta: {
      backgroundColor: theme.heroAccent,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: RADIUS.lg,
      marginBottom: SPACING.xl,
    },
    heroCtaText: {
      color: '#0f172a',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },

    // Hero crypto ticker
    heroTicker: {
      flexDirection: 'row',
      gap: SPACING.sm,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    heroTickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: RADIUS.full,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    heroTickerSymbol: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.6)',
    },
    heroTickerPrice: {
      fontFamily: FONTS.mono,
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    heroTickerChange: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '600',
    },

    // ─── Theme Toggle ────────────────────────────────────────────────────────

    themeToggle: {
      position: 'absolute',
      top: SPACING.md,
      right: SPACING.md,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: RADIUS.full,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeToggleText: {
      fontSize: 18,
    },

    // ─── Tab Bar (Segmented Control) ─────────────────────────────────────────

    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundSubtle,
      borderRadius: RADIUS.lg,
      padding: 4,
      marginBottom: SPACING.lg,
      marginTop: SPACING.lg,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: RADIUS.md,
    },
    tabButtonActive: {
      backgroundColor: theme.surface,
      ...(theme.hasShadow ? SHADOWS.sm : { borderWidth: 1, borderColor: theme.surfaceBorder }),
    },
    tabButtonText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '600',
      color: theme.textMuted,
    },
    tabButtonTextActive: {
      color: theme.text,
    },

    // ─── Card ────────────────────────────────────────────────────────────────

    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      ...(theme.hasShadow ? SHADOWS.md : {}),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: SPACING.md,
    },
    cardEmoji: {
      fontSize: 22,
    },
    cardLabel: {
      fontFamily: FONTS.mono,
      fontSize: 12,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginBottom: SPACING.xs,
    },

    // ─── Description ─────────────────────────────────────────────────────────

    descContainer: {
      marginBottom: SPACING.md,
      marginTop: SPACING.sm,
    },
    descText: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 24,
    },
    descHighlight: {
      color: theme.accent,
      fontWeight: '700',
    },

    // ─── Input Row (horizontal layout for CalcCard) ──────────────────────────

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: SPACING.lg,
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: theme.inputBg,
      borderWidth: 1.5,
      borderColor: theme.inputBorder,
      borderRadius: RADIUS.md,
      paddingVertical: 14,
      paddingHorizontal: 16,
      color: theme.inputText,
      fontSize: 17,
      fontFamily: FONTS.mono,
      fontWeight: '500',
    },
    inputFocused: {
      borderColor: theme.inputFocusBorder,
      borderWidth: 2,
      backgroundColor: theme.inputFocusBg,
    },
    inputSuffix: {
      position: 'absolute',
      right: 14,
      color: theme.textMuted,
      fontFamily: FONTS.mono,
      fontSize: 16,
      fontWeight: '500',
    },
    inputPrefix: {
      position: 'absolute',
      left: 14,
      color: theme.textMuted,
      fontFamily: FONTS.mono,
      fontSize: 16,
      fontWeight: '500',
      zIndex: 1,
    },
    operator: {
      color: theme.textMuted,
      fontSize: 14,
      fontFamily: FONTS.mono,
      fontWeight: '600',
    },

    // ─── Input Group (vertical layout for ImagineCalc) ───────────────────────

    inputRow2Col: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: SPACING.md,
    },
    inputCol: {
      flex: 1,
    },
    inputGroup: {
      marginBottom: SPACING.md,
    },
    inputLabel: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    inputHelperText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 6,
      fontStyle: 'italic',
    },
    sectionLabel: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: SPACING.sm,
      marginTop: SPACING.xs,
    },

    // ─── Chips (selector pills) ──────────────────────────────────────────────

    chipRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
      flexWrap: 'wrap',
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: RADIUS.full,
      borderWidth: 1.5,
      borderColor: theme.inputBorder,
      backgroundColor: theme.surfaceHover,
    },
    chipSelected: {
      borderColor: theme.accentBorder,
      backgroundColor: theme.accentBg,
    },
    chipText: {
      fontFamily: FONTS.mono,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
    },
    chipTextSelected: {
      color: theme.accent,
    },

    // ─── Live Price Indicator ────────────────────────────────────────────────

    currentPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.md,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.surfaceHover,
      borderRadius: RADIUS.md,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.positive,
    },
    currentPriceText: {
      fontFamily: FONTS.mono,
      fontSize: 13,
      color: theme.textSecondary,
    },
    currentPriceAmount: {
      fontFamily: FONTS.mono,
      fontSize: 13,
      fontWeight: '700',
      color: theme.accent,
    },

    // ─── Result Box (CalcCard) ───────────────────────────────────────────────

    resultBox: {
      backgroundColor: theme.surfaceHover,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: RADIUS.md,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 56,
    },
    resultBoxActive: {
      backgroundColor: theme.accentBg,
      borderColor: theme.accentBorder,
    },
    resultLabel: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    resultValue: {
      fontFamily: FONTS.mono,
      fontWeight: '700',
      fontSize: 18,
      color: theme.textMuted,
    },
    resultValueActive: {
      fontSize: 24,
      color: theme.accent,
    },

    // ─── Copy Button ─────────────────────────────────────────────────────────

    copyButton: {
      marginTop: 12,
      color: theme.textMuted,
      fontSize: 12,
      fontFamily: FONTS.mono,
      fontWeight: '600',
      letterSpacing: 0.5,
      textAlign: 'center',
    },

    // ─── Results Grid (ImagineCalc, TimeMachineCalc) ─────────────────────────

    resultsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: SPACING.sm,
    },
    resultGridItem: {
      flex: 1,
      minWidth: '46%',
      borderWidth: 1,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
    },

    // ─── Investment Result Cards ─────────────────────────────────────────────

    investResultRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    investResultCard: {
      borderWidth: 1,
      borderRadius: RADIUS.md,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    investResultLabel: {
      fontFamily: FONTS.mono,
      fontSize: 10,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    investResultValue: {
      fontFamily: FONTS.mono,
      fontWeight: '700',
    },

    // ─── Multiplier Badge ────────────────────────────────────────────────────

    multiplierBadge: {
      minWidth: 64,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: SPACING.sm,
    },
    multiplierText: {
      fontFamily: FONTS.mono,
      fontWeight: '700',
      letterSpacing: -0.3,
    },

    // ─── Chart Container ─────────────────────────────────────────────────────

    chartContainer: {
      marginVertical: SPACING.lg,
      borderRadius: RADIUS.lg,
      backgroundColor: theme.surfaceHover,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      padding: SPACING.md,
      paddingTop: SPACING.md + 4,
      overflow: 'visible',
    },
    chartTitle: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: SPACING.sm,
    },
    chartLegend: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: SPACING.lg,
      marginBottom: SPACING.sm,
    },
    chartLegendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    chartLegendDot: {
      width: 10,
      height: 3,
      borderRadius: 2,
    },
    chartLegendText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.textSecondary,
    },

    // ─── Crypto Price Cards ──────────────────────────────────────────────────

    cryptoPriceRow: {
      flexDirection: 'row',
      paddingVertical: SPACING.sm,
    },
    cryptoPriceCard: {
      backgroundColor: theme.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      paddingHorizontal: 18,
      marginRight: 10,
      minWidth: 140,
      alignItems: 'center',
      ...(theme.hasShadow ? SHADOWS.sm : {}),
    },
    cryptoPriceSymbol: {
      fontFamily: FONTS.mono,
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 6,
    },
    cryptoPriceValue: {
      fontFamily: FONTS.mono,
      fontSize: 17,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    cryptoPriceChange: {
      fontFamily: FONTS.mono,
      fontSize: 12,
      fontWeight: '600',
    },
    lastUpdatedText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.textMuted,
      marginBottom: 10,
    },

    // ─── Year Picker ─────────────────────────────────────────────────────────

    yearPickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1.5,
      borderRadius: RADIUS.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: SPACING.md,
    },
    yearPickerButtonText: {
      fontFamily: FONTS.mono,
      fontSize: 16,
      fontWeight: '600',
    },
    yearPickerOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    yearPickerModal: {
      width: 280,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.md,
      paddingHorizontal: SPACING.md,
      ...(theme.hasShadow
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
            elevation: 20,
          }
        : {}),
    },
    yearPickerTitle: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    yearPickerList: {
      overflow: 'hidden',
      borderRadius: RADIUS.md,
      position: 'relative',
    },
    yearPickerHighlight: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderWidth: 1,
      borderRadius: 10,
      zIndex: 0,
    },
    yearPickerItem: {
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    yearPickerItemText: {
      fontFamily: FONTS.mono,
      fontSize: 18,
    },
    yearPickerDone: {
      marginTop: SPACING.md,
      borderRadius: RADIUS.md,
      paddingVertical: 12,
      alignItems: 'center',
    },
    yearPickerDoneText: {
      color: '#0f172a',
      fontWeight: '700',
      fontSize: 15,
    },

    // ─── Standard Calculator ─────────────────────────────────────────────────

    calcDisplay: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      paddingHorizontal: 18,
      marginTop: SPACING.md,
      marginBottom: SPACING.md,
      alignItems: 'flex-end',
      minHeight: 80,
      justifyContent: 'flex-end',
    },
    calcDisplayText: {
      fontFamily: FONTS.mono,
      fontSize: 32,
      fontWeight: '600',
      color: theme.text,
      letterSpacing: 0.5,
    },
    calcPreview: {
      fontFamily: FONTS.mono,
      fontSize: 14,
      color: theme.accentMuted,
      marginBottom: 4,
    },
    calcGrid: {
      gap: SPACING.sm,
    },
    calcRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    calcBtn: {
      flex: 1,
      aspectRatio: 1.5,
      backgroundColor: theme.surfaceHover,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: RADIUS.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calcBtnOperator: {
      backgroundColor: theme.accentBg,
      borderColor: theme.accentBorder,
    },
    calcBtnFunction: {
      backgroundColor: theme.surfaceHover,
      borderColor: theme.surfaceBorder,
    },
    calcBtnEquals: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    calcBtnText: {
      fontFamily: FONTS.mono,
      fontSize: 20,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    calcBtnTextOperator: {
      color: theme.accent,
      fontSize: 22,
    },
    calcBtnTextFunction: {
      color: theme.textSecondary,
    },
    calcBtnTextEquals: {
      color: theme.textInverse,
      fontSize: 24,
      fontWeight: '700',
    },

    // ─── Quick Reference Table ───────────────────────────────────────────────

    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    tableHeaderRow: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      marginTop: SPACING.md,
      marginBottom: 2,
    },
    tableHeader: {
      fontFamily: FONTS.mono,
      fontWeight: '700',
      fontSize: 10,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    tableCellHighlight: {
      fontFamily: FONTS.mono,
      fontWeight: '600',
      fontSize: 14,
      color: theme.accent,
    },
    tableCell: {
      fontFamily: FONTS.mono,
      fontSize: 14,
      color: theme.textSecondary,
    },
    tableCellTip: {
      fontSize: 13,
      color: theme.textMuted,
    },

    // ─── FAQ (Accordion) ─────────────────────────────────────────────────────

    faqList: {
      marginTop: SPACING.md,
      gap: 2,
    },
    faqItem: {
      borderRadius: RADIUS.md,
      overflow: 'hidden',
    },
    faqQuestion: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.surfaceHover,
    },
    faqQuestionText: {
      fontFamily: FONTS.mono,
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '600',
      flex: 1,
      marginRight: SPACING.sm,
    },
    faqArrow: {
      fontSize: 12,
      color: theme.textMuted,
    },
    faqAnswer: {
      paddingVertical: 12,
      paddingHorizontal: SPACING.md,
    },
    faqAnswerText: {
      fontSize: 13,
      color: theme.textMuted,
      lineHeight: 20,
    },

    // ─── Footer ──────────────────────────────────────────────────────────────

    footerText: {
      textAlign: 'center',
      marginTop: SPACING.xl,
      color: theme.textMuted,
      fontSize: 12,
      fontFamily: FONTS.mono,
    },

    // ─── Validation & Hints ──────────────────────────────────────────────────

    errorText: {
      color: theme.negative,
      fontSize: 12,
      fontFamily: FONTS.mono,
      marginTop: SPACING.sm,
    },
    hintText: {
      color: theme.textMuted,
      fontSize: 12,
      fontFamily: FONTS.mono,
      marginTop: SPACING.sm,
    },

    // ─── Error Banner ────────────────────────────────────────────────────────

    errorBanner: {
      backgroundColor: theme.negativeBg,
      borderWidth: 1,
      borderColor: theme.negativeBorder,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    errorBannerText: {
      fontFamily: FONTS.mono,
      fontSize: 12,
      color: theme.negative,
      flex: 1,
    },
    retryButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: theme.negativeBorder,
    },
    retryButtonText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      fontWeight: '700',
      color: theme.negative,
    },

    // ─── Disclaimer ──────────────────────────────────────────────────────────

    disclaimerText: {
      fontFamily: FONTS.mono,
      fontSize: 11,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: SPACING.md,
      fontStyle: 'italic',
    },

    // ─── Skeleton Loading ────────────────────────────────────────────────────

    skeleton: {
      backgroundColor: theme.skeleton,
      borderRadius: RADIUS.sm,
    },
  });
}
