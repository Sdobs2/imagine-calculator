import { StyleSheet, Platform } from 'react-native';
import { MONO } from './utils/constants';

export default function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 48,
    },

    // Header
    header: {
      alignItems: 'center',
      marginBottom: 28,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 12,
    },
    headerTag: {
      fontFamily: MONO,
      fontSize: 11,
      fontWeight: '600',
      color: theme.accentText,
      textTransform: 'uppercase',
      letterSpacing: 3,
    },
    headerTitle: {
      fontSize: 36,
      fontWeight: '700',
      color: theme.text,
      letterSpacing: -0.5,
    },
    headerSub: {
      color: theme.textTertiary,
      fontSize: 14,
      fontFamily: MONO,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
    },

    // Theme toggle
    themeToggle: {
      position: 'absolute',
      right: 0,
      padding: 8,
    },
    themeToggleText: {
      fontSize: 20,
    },

    // Tab bar
    tabBar: {
      flexDirection: 'row',
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    tabButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 4,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabButtonActive: {
      borderBottomColor: theme.accent,
    },
    tabButtonText: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
      letterSpacing: 0.5,
    },
    tabButtonTextActive: {
      color: theme.accent,
    },

    // Card
    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: 18,
      paddingVertical: 28,
      paddingHorizontal: 22,
      marginBottom: 18,
      ...(theme.shadow
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
            ...(Platform.OS === 'android' ? { elevation: 2 } : {}),
          }
        : {}),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    },
    cardEmoji: {
      fontSize: 22,
    },
    cardLabel: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    // Description
    descContainer: {
      marginBottom: 16,
    },
    descText: {
      fontSize: 15,
      color: theme.textSecondary,
      fontStyle: 'italic',
      lineHeight: 22,
    },
    descHighlight: {
      color: theme.accent,
      fontWeight: '600',
      fontStyle: 'italic',
    },

    // Input row
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 18,
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      color: theme.text,
      fontSize: 18,
      fontFamily: MONO,
    },
    inputFocused: {
      borderColor: theme.inputFocusBorder,
    },
    inputSuffix: {
      position: 'absolute',
      right: 14,
      color: theme.textTertiary,
      fontFamily: MONO,
      fontSize: 16,
    },
    inputPrefix: {
      position: 'absolute',
      left: 14,
      color: theme.textTertiary,
      fontFamily: MONO,
      fontSize: 16,
      zIndex: 1,
    },
    operator: {
      color: theme.textTertiary,
      fontSize: 14,
      fontFamily: MONO,
    },

    // Input with label (vertical layout for ImagineCalc)
    inputGroup: {
      marginBottom: 14,
    },
    inputLabel: {
      fontFamily: MONO,
      fontSize: 11,
      fontWeight: '600',
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 6,
    },

    // Result box
    resultBox: {
      backgroundColor: theme.surfaceHover,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 52,
    },
    resultBoxActive: {
      backgroundColor: theme.accentBg,
      borderColor: theme.accentBorder,
    },
    resultLabel: {
      fontFamily: MONO,
      fontSize: 12,
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    resultValue: {
      fontFamily: MONO,
      fontWeight: '700',
      fontSize: 18,
      color: theme.textTertiary,
    },
    resultValueActive: {
      fontSize: 24,
      color: theme.accent,
    },

    // Copy button
    copyButton: {
      marginTop: 10,
      color: theme.textTertiary,
      fontSize: 12,
      fontFamily: MONO,
      letterSpacing: 0.5,
    },

    // Investment result row
    investResultRow: {
      flexDirection: 'row',
      gap: 8,
    },
    investResultCard: {
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    investResultLabel: {
      fontFamily: MONO,
      fontSize: 10,
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 6,
    },
    investResultValue: {
      fontFamily: MONO,
      fontWeight: '700',
    },
    multiplierBadge: {
      minWidth: 64,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 6,
    },
    multiplierText: {
      fontFamily: MONO,
      fontWeight: '700',
      letterSpacing: -0.3,
    },

    // Results 2x2 grid
    resultsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    resultGridItem: {
      flex: 1,
      minWidth: '45%',
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
    },

    // Quick reference table
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    tableHeaderRow: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      marginTop: 14,
      marginBottom: 2,
    },
    tableHeader: {
      fontFamily: MONO,
      fontWeight: '500',
      fontSize: 11,
      color: theme.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    tableCellHighlight: {
      fontFamily: MONO,
      fontWeight: '600',
      fontSize: 14,
      color: theme.accent,
    },
    tableCell: {
      fontFamily: MONO,
      fontSize: 14,
      color: theme.textSecondary,
    },
    tableCellTip: {
      fontSize: 13,
      color: theme.textTertiary,
    },

    // FAQ
    faqList: {
      marginTop: 12,
      gap: 14,
    },
    faqItem: {
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      paddingBottom: 12,
    },
    faqQuestion: {
      fontFamily: MONO,
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 6,
      fontWeight: '600',
    },
    faqAnswer: {
      fontSize: 13,
      color: theme.textTertiary,
      lineHeight: 18,
    },

    // Standard calculator
    calcDisplay: {
      backgroundColor: theme.inputBg,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 18,
      marginTop: 14,
      marginBottom: 14,
      alignItems: 'flex-end',
      minHeight: 72,
      justifyContent: 'flex-end',
    },
    calcDisplayText: {
      fontFamily: MONO,
      fontSize: 32,
      fontWeight: '600',
      color: theme.text,
      letterSpacing: 0.5,
    },
    calcPreview: {
      fontFamily: MONO,
      fontSize: 14,
      color: theme.accentText,
      marginBottom: 4,
    },
    calcGrid: {
      gap: 8,
    },
    calcRow: {
      flexDirection: 'row',
      gap: 8,
    },
    calcBtn: {
      flex: 1,
      aspectRatio: 1.5,
      backgroundColor: theme.surfaceHover,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: 12,
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
      fontFamily: MONO,
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
      color: theme.shadow ? '#ffffff' : '#0a0a0b',
      fontSize: 24,
      fontWeight: '700',
    },

    // Footer
    footerHint: {
      textAlign: 'center',
      marginTop: 24,
      color: theme.textTertiary,
      fontSize: 12,
      fontFamily: MONO,
    },

    // Validation feedback
    errorText: {
      color: theme.negative,
      fontSize: 12,
      fontFamily: MONO,
      marginTop: 8,
    },
    hintText: {
      color: theme.textTertiary,
      fontSize: 12,
      fontFamily: MONO,
      marginTop: 8,
    },

    // Crypto price cards
    cryptoPriceRow: {
      flexDirection: 'row',
      paddingVertical: 8,
    },
    cryptoPriceCard: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.surfaceBorder,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
      marginRight: 10,
      minWidth: 140,
      alignItems: 'center',
      ...(theme.shadow
        ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
          }
        : {}),
    },
    cryptoPriceSymbol: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
      marginBottom: 6,
    },
    cryptoPriceValue: {
      fontFamily: MONO,
      fontSize: 17,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    cryptoPriceChange: {
      fontFamily: MONO,
      fontSize: 12,
      fontWeight: '600',
    },
    lastUpdatedText: {
      fontFamily: MONO,
      fontSize: 11,
      color: theme.textTertiary,
      marginBottom: 10,
    },

    // Crypto selector chips
    chipRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.inputBorder,
      backgroundColor: theme.surfaceHover,
    },
    chipSelected: {
      borderColor: theme.accentBorder,
      backgroundColor: theme.accentBg,
    },
    chipText: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTertiary,
    },
    chipTextSelected: {
      color: theme.accent,
    },

    // Live indicator
    currentPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.positive,
    },
    currentPriceText: {
      fontFamily: MONO,
      fontSize: 13,
      color: theme.textSecondary,
    },
    currentPriceAmount: {
      fontFamily: MONO,
      fontSize: 13,
      fontWeight: '700',
      color: theme.accent,
    },

    // Disclaimer
    disclaimerText: {
      fontFamily: MONO,
      fontSize: 11,
      color: theme.textTertiary,
      textAlign: 'center',
      marginTop: 14,
      fontStyle: 'italic',
    },

    // Error banner
    errorBanner: {
      backgroundColor: theme.negativeBg,
      borderWidth: 1,
      borderColor: theme.negativeBorder,
      borderRadius: 10,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
    },
    errorBannerText: {
      fontFamily: MONO,
      fontSize: 12,
      color: theme.negative,
      flex: 1,
    },
    retryButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.negativeBorder,
    },
    retryButtonText: {
      fontFamily: MONO,
      fontSize: 11,
      fontWeight: '600',
      color: theme.negative,
    },

    // Skeleton loading
    skeleton: {
      backgroundColor: theme.surfaceHover,
      borderRadius: 8,
    },
  });
}
