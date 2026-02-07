import { Platform } from 'react-native';

export const calculators = [
  { id: 'whatIs' },
  { id: 'whatPercent' },
  { id: 'change' },
];

export const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
export const SANS = Platform.select({ ios: 'System', default: 'sans-serif' });
