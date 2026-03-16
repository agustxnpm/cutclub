import { StyleSheet, Platform } from 'react-native';

export const colors = {
  background: '#0F0F0F',
  surface: '#1B1B1B',
  surfaceElevated: '#222222',
  border: '#2C2C2C',
  textPrimary: '#F5F5F5',
  textSecondary: '#A1A1A1',
  primary: '#0048B3',
  primaryLight: '#1A5FCC',
  success: '#4CAF50',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
};

export const fonts = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
};

export const shadows = {
  sm: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
    android: { elevation: 3 },
    default: {},
  }) as object,
  md: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
    android: { elevation: 6 },
    default: {},
  }) as object,
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxl,
  },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    fontSize: fonts.body,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  buttonPrimary: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fonts.body,
    fontWeight: '600' as const,
  },
});
