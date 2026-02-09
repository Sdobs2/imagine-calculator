/**
 * Theme Context — provides theme + mode + toggle across the app.
 * Persists user preference in localStorage (web) for seamless returns.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { themes } from './theme';

const ThemeContext = createContext();

// ─── Persistence helpers (web: localStorage, native: no-op) ────────────────

function getStoredMode() {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem('imagine-theme-mode') || 'dark';
    } catch {
      return 'dark';
    }
  }
  return 'dark'; // Default to dark for premium feel
}

function storeMode(mode) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem('imagine-theme-mode', mode);
    } catch {
      // Silent fail — localStorage might be unavailable (e.g. private browsing)
    }
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getStoredMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      storeMode(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: themes[mode],
      mode,
      isDark: mode === 'dark',
      toggleTheme,
    }),
    [mode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
