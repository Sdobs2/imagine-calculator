import { Platform } from 'react-native';

export const calculators = [
  { id: 'whatIs', label: 'What is X% of Y?', emoji: '\u26A1' },
  { id: 'whatPercent', label: 'X is what % of Y?', emoji: '\uD83D\uDD0D' },
  { id: 'change', label: '% Change from X to Y', emoji: '\uD83D\uDCC8' },
];

export const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
export const SANS = Platform.select({ ios: 'System', default: 'sans-serif' });
