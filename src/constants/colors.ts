export const colors = {
  // Brand
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  primaryMuted: '#EEF2FF',

  // Semantic
  income: '#10B981',
  incomeDark: '#047857',
  incomeLight: '#ECFDF5',
  incomeBorder: '#A7F3D0',

  expense: '#EF4444',
  expenseDark: '#B91C1C',
  expenseLight: '#FEF2F2',
  expenseBorder: '#FECACA',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Surfaces & Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  surfaceTertiary: '#E2E8F0',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textPlaceholder: '#94A3B8',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#4F46E5',

  // Card themes
  cardDark: '#0F172A',
  cardDarkSecondary: '#1E293B',
  cardDarkText: '#FFFFFF',
  cardDarkSubtext: '#94A3B8',

  // Feedback & Overlay
  shadow: 'rgba(15, 23, 42, 0.08)',
  overlay: 'rgba(15, 23, 42, 0.5)',
  disabled: '#CBD5E1',
} as const;

// Backwards compatibility
export const colores = colors;

export type ColorType = typeof colors;