import { StyleSheet, Platform } from 'react-native';

/* ═══════════════════════════════════════════════════
   Design System: Dark Barber Editorial
   Based on DESIGN.md — "The Modern Atelier"
   ═══════════════════════════════════════════════════ */

export const colors = {
  /* Neutral Foundation */
  background: '#0E0E0E',
  surface: '#0E0E0E',
  surfaceContainerLowest: '#000000',
  surfaceContainerLow: '#131313',
  surfaceContainer: '#191A1A',
  surfaceContainerHigh: '#1F2020',
  surfaceContainerHighest: '#252626',
  surfaceBright: '#2C2C2C',

  /* Ghost Border & Outlines */
  outline: '#767575',
  outlineVariant: '#484848',
  ghostBorder: 'rgba(72, 72, 72, 0.20)',

  /* Typography */
  onSurface: '#E7E5E4',
  onSurfaceVariant: '#ACABAA',
  onBackground: '#E7E5E4',
  inverseSurface: '#FCF9F8',
  inverseOnSurface: '#565555',

  /* Primary (Electric Cobalt) — use as "surgical strike" */
  primary: '#B2C5FF',
  primaryDim: '#9DB7FF',
  primaryContainer: '#0040A1',
  onPrimary: '#003A93',
  onPrimaryContainer: '#C0CFFF',
  onPrimaryFixed: '#003992',
  primaryFixed: '#DAE2FF',
  primaryFixedDim: '#C6D3FF',
  surfaceTint: '#B2C5FF',
  inversePrimary: '#2359C3',

  /* Secondary */
  secondary: '#9E9DA1',
  secondaryContainer: '#3B3B3F',
  onSecondary: '#1F2023',
  onSecondaryContainer: '#C0BEC3',

  /* Tertiary */
  tertiary: '#F1EBFF',
  tertiaryContainer: '#E3DBFD',
  onTertiary: '#5A5570',

  /* Error */
  error: '#EE7D77',
  errorDim: '#BB5551',
  errorContainer: '#7F2927',
  onError: '#490106',
  onErrorContainer: '#FF9993',

  /* Semantic */
  success: '#4CAF50',
  successMuted: 'rgba(76, 175, 80, 0.14)',
  warning: '#F59E0B',

  /* Halo / Glow */
  primaryHalo: 'rgba(178, 197, 255, 0.10)',
  primaryGlow: 'rgba(0, 72, 179, 0.05)',
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
  '6': 48,   // Spacing 6 from DESIGN.md (2rem)
  '12': 96,  // Spacing 12
  '16': 128, // Spacing 16
};

export const radius = {
  sm: 4,     // DEFAULT 0.25rem
  md: 12,    // 0.75rem — buttons, inner elements
  lg: 16,    // 1rem — outer cards
  xl: 12,    // same as md (no circular FABs per design)
  full: 9999,
};

export const fonts = {
  /* Font Families — DESIGN.md: Epilogue (Display/Headlines) + Inter (UI/Body) */
  familyDisplay: 'Epilogue_700Bold',
  familyDisplayBlack: 'Epilogue_900Black',
  familyDisplayItalic: 'Epilogue_700Bold_Italic',
  familyDisplayBlackItalic: 'Epilogue_900Black_Italic',
  familyBody: 'Inter_400Regular',
  familyBodyMedium: 'Inter_500Medium',
  familyBodySemiBold: 'Inter_600SemiBold',
  familyBodyBold: 'Inter_700Bold',

  /* Display — Epilogue, tight letter-spacing (-0.02em) */
  displayLg: 56,  // 3.5rem hero
  displayMd: 48,
  /* Headlines — Epilogue */
  headlineLg: 32,
  headlineMd: 28,
  headlineSm: 22,
  /* Title — Inter */
  titleLg: 22,
  titleMd: 18,
  titleSm: 16,
  /* Body — Inter */
  bodyLg: 16,
  bodyMd: 14,    // standard body
  bodySm: 13,
  /* Label — Inter, always uppercase +0.05em tracking */
  labelLg: 14,
  labelMd: 12,
  labelSm: 10,
};

export const shadows = {
  /* Ambient shadows: "felt, not seen" */
  ambient: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.5,
      shadowRadius: 48,
    },
    android: { elevation: 8 },
    default: {},
  }) as object,
  /* Subtle lift for floating elements */
  float: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
    },
    android: { elevation: 4 },
    default: {},
  }) as object,
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  /* Input: minimalist, bottom ghost border until focused */
  input: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.ghostBorder,
    borderRadius: 0,
    paddingHorizontal: spacing.base,
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBody,
    color: colors.onSurface,
  },
  inputFocused: {
    borderBottomColor: colors.primary,
  },
  /* Primary button: primaryContainer bg, md radius */
  buttonPrimary: {
    height: 48,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.onPrimaryContainer,
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodyBold,
  },
  /* Secondary button: ghost style */
  buttonSecondary: {
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    borderRadius: radius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  buttonSecondaryText: {
    color: colors.onSurface,
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodySemiBold,
  },
  /* Tertiary button: text only, uppercase */
  buttonTertiary: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  buttonTertiaryText: {
    color: colors.primary,
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBodyBold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
});
