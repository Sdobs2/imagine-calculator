/**
 * Responsive layout hook — adapts UI to screen size.
 * Uses useWindowDimensions for live updates on resize (web).
 */

import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from './theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.sm,
    isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    // Max content width: 720px on desktop, full width minus padding on mobile
    containerWidth: Math.min(width - 40, 720),
    // Horizontal padding to center the container on wide screens
    containerPadding: width >= BREAKPOINTS.lg ? Math.max(20, (width - 720) / 2) : 20,
  };
}
