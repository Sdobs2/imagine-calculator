/**
 * Design System — ImagineCalculator
 *
 * Complete design token system supporting light and dark modes.
 * Inspired by premium fintech applications (Stripe, Linear, Robinhood).
 */

import { Platform } from 'react-native';

// ─── Typography ──────────────────────────────────────────────────────────────

export const FONTS = {
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  sans: Platform.select({ ios: 'System', default: 'sans-serif' }),
};

export const TYPE_SCALE = {
  hero: { fontSize: 40, lineHeight: 48, fontWeight: '800', letterSpacing: -1.5 },
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  label: { fontSize: 11, lineHeight: 16, fontWeight: '600', letterSpacing: 1.5 },
  mono: { fontSize: 18, lineHeight: 24, fontWeight: '600', fontFamily: FONTS.mono },
  monoSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500', fontFamily: FONTS.mono },
  monoLarge: { fontSize: 28, lineHeight: 36, fontWeight: '700', fontFamily: FONTS.mono },
};

// ─── Spacing (4px base) ─────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ─── Border Radius ──────────────────────────────────────────────────────────

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// ─── Shadows ────────────────────────────────────────────────────────────────

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    ...(Platform.OS === 'android' ? { elevation: 1 } : {}),
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    ...(Platform.OS === 'android' ? { elevation: 3 } : {}),
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    ...(Platform.OS === 'android' ? { elevation: 6 } : {}),
  },
};

// ─── Breakpoints ────────────────────────────────────────────────────────────

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// ─── Animation Durations ────────────────────────────────────────────────────

export const DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
};

// ─── Color Palettes ─────────────────────────────────────────────────────────

export const themes = {
  light: {
    // Backgrounds
    background: '#f8fafc',
    backgroundSubtle: '#f1f5f9',

    // Surfaces
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    surfaceBorder: '#e2e8f0',
    surfaceElevated: '#ffffff',

    // Text hierarchy
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textInverse: '#ffffff',

    // Accent (warm gold — the signature color)
    accent: '#f59e0b',
    accentHover: '#d97706',
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
    accentText: '#92400e',
    accentMuted: 'rgba(245,158,11,0.5)',

    // Success / Positive
    positive: '#059669',
    positiveBg: '#ecfdf5',
    positiveBorder: '#a7f3d0',
    positiveText: '#065f46',

    // Error / Negative
    negative: '#dc2626',
    negativeBg: '#fef2f2',
    negativeBorder: '#fecaca',
    negativeText: '#991b1b',

    // Inputs
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    inputFocusBorder: '#f59e0b',
    inputFocusBg: '#fffdf5',
    inputText: '#0f172a',
    inputPlaceholder: '#94a3b8',

    // Dividers & Utilities
    divider: '#e2e8f0',
    overlay: 'rgba(0,0,0,0.5)',
    skeleton: '#e2e8f0',
    hasShadow: true,

    // Hero section (always dark for dramatic contrast)
    heroBg: '#0f172a',
    heroText: '#f1f5f9',
    heroTextSecondary: '#94a3b8',
    heroAccent: '#fbbf24',
    heroGlow: 'rgba(251,191,36,0.06)',

    // Chart palette
    chartLine: '#f59e0b',
    chartFill: 'rgba(245,158,11,0.15)',
    chartInvested: '#94a3b8',
    chartInvestedFill: 'rgba(148,163,184,0.1)',
    chartGrid: '#e2e8f0',
    chartLabel: '#94a3b8',
  },

  dark: {
    // Backgrounds — hero is distinctly different from content
    background: '#0d0d1a',
    backgroundSubtle: '#16162a',

    // Surfaces — increased opacity for better card visibility
    surface: 'rgba(255,255,255,0.06)',
    surfaceHover: 'rgba(255,255,255,0.08)',
    surfaceBorder: 'rgba(255,255,255,0.10)',
    surfaceElevated: 'rgba(255,255,255,0.08)',

    // Text hierarchy
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    textInverse: '#0f172a',

    // Accent
    accent: '#fbbf24',
    accentHover: '#f59e0b',
    accentBg: 'rgba(251,191,36,0.12)',
    accentBorder: 'rgba(251,191,36,0.30)',
    accentText: '#fbbf24',
    accentMuted: 'rgba(251,191,36,0.4)',

    // Success / Positive
    positive: '#34d399',
    positiveBg: 'rgba(52,211,153,0.12)',
    positiveBorder: 'rgba(52,211,153,0.25)',
    positiveText: '#34d399',

    // Error / Negative
    negative: '#f87171',
    negativeBg: 'rgba(248,113,113,0.12)',
    negativeBorder: 'rgba(248,113,113,0.25)',
    negativeText: '#f87171',

    // Inputs
    inputBg: 'rgba(255,255,255,0.05)',
    inputBorder: 'rgba(255,255,255,0.12)',
    inputFocusBorder: '#fbbf24',
    inputFocusBg: 'rgba(251,191,36,0.06)',
    inputText: '#f1f5f9',
    inputPlaceholder: '#64748b',

    // Dividers & Utilities
    divider: 'rgba(255,255,255,0.08)',
    overlay: 'rgba(0,0,0,0.7)',
    skeleton: 'rgba(255,255,255,0.08)',
    hasShadow: false,

    // Hero section — noticeably different from content background
    heroBg: '#06060f',
    heroText: '#f1f5f9',
    heroTextSecondary: '#94a3b8',
    heroAccent: '#fbbf24',
    heroGlow: 'rgba(251,191,36,0.07)',

    // Chart palette
    chartLine: '#fbbf24',
    chartFill: 'rgba(251,191,36,0.15)',
    chartInvested: '#64748b',
    chartInvestedFill: 'rgba(100,116,139,0.15)',
    chartGrid: 'rgba(255,255,255,0.08)',
    chartLabel: '#64748b',
  },
};
