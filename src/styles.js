import { StyleSheet } from 'react-native';
import { MONO } from './utils/constants';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTag: {
    fontFamily: MONO,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(245,158,11,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    fontFamily: MONO,
    marginTop: 8,
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
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
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Description
  descContainer: {
    marginBottom: 16,
  },
  descText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    fontStyle: 'italic',
  },
  descHighlight: {
    color: '#f59e0b',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 18,
    fontFamily: MONO,
  },
  inputFocused: {
    borderColor: 'rgba(245,158,11,0.5)',
  },
  inputSuffix: {
    position: 'absolute',
    right: 14,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: MONO,
    fontSize: 16,
  },
  inputPrefix: {
    position: 'absolute',
    left: 14,
    color: 'rgba(255,255,255,0.3)',
    fontFamily: MONO,
    fontSize: 16,
    zIndex: 1,
  },
  operator: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontFamily: MONO,
  },

  // Result box
  resultBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  resultBoxActive: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.2)',
  },
  resultLabel: {
    fontFamily: MONO,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  resultValue: {
    fontFamily: MONO,
    fontWeight: '700',
    fontSize: 18,
    color: 'rgba(255,255,255,0.15)',
  },
  resultValueActive: {
    fontSize: 24,
    color: '#f59e0b',
  },

  // Copy button
  copyButton: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.25)',
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
    color: 'rgba(255,255,255,0.35)',
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

  // Quick reference table
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginTop: 14,
    marginBottom: 2,
  },
  tableHeader: {
    fontFamily: MONO,
    fontWeight: '500',
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  tableCellHighlight: {
    fontFamily: MONO,
    fontWeight: '600',
    fontSize: 14,
    color: '#f59e0b',
  },
  tableCell: {
    fontFamily: MONO,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  tableCellTip: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },

  // Footer
  footerHint: {
    textAlign: 'center',
    marginTop: 24,
    color: 'rgba(255,255,255,0.15)',
    fontSize: 12,
    fontFamily: MONO,
  },

  // Validation feedback
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: MONO,
    marginTop: 8,
  },
  hintText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    fontFamily: MONO,
    marginTop: 8,
  },
});

export default styles;
