import { Platform } from 'react-native';

export const calculators = [
  { id: 'whatIs', label: 'What is X% of Y?' },
  { id: 'whatPercent', label: 'X is what % of Y?' },
  { id: 'change', label: '% Change from X to Y' },
];

export const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
export const SANS = Platform.select({ ios: 'System', default: 'sans-serif' });
