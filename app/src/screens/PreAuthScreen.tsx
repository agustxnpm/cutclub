import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Phone } from 'lucide-react-native';
import { colors, spacing, radius, fonts, shadows } from '../styles/theme';

interface PreAuthScreenProps {
  onRegistro: () => void;
  onLogin: () => void;
}

export default function PreAuthScreen({ onRegistro, onLogin }: PreAuthScreenProps) {
  return (
    <View style={styles.screen}>
      {/* ── Editorial Header ── */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Bienvenido</Text>
        <Text style={styles.headlineWhite}>Crear una</Text>
        <Text style={styles.headlinePrimary}>Cuenta</Text>
        <Text style={styles.headerSub}>
          Accedé a tu tarjeta de fidelidad, beneficios y tu código de invitado.
        </Text>
      </View>


      {/* ── Auth Options ── */}
      <View style={styles.options}>
        {/* Google — placeholder */}
        <TouchableOpacity style={styles.optionButton} activeOpacity={0.7} disabled>
          <Svg width={20} height={20} viewBox="0 0 48 48">
            <Path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
            <Path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
            <Path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
            <Path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
          </Svg>
          <Text style={styles.optionLabel}>Continuar con Google</Text>
        </TouchableOpacity>

        {/* Teléfono — funcional */}
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonActive]}
          activeOpacity={0.84}
          onPress={onRegistro}
        >
          <Phone size={20} color={colors.onPrimaryContainer} strokeWidth={1.5} />
          <Text style={[styles.optionLabel, styles.optionLabelActive]}>
            Continuar con teléfono
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Already have account ── */}
      <TouchableOpacity
        style={styles.signInLink}
        onPress={onLogin}
        activeOpacity={0.7}
      >
        <Text style={styles.signInText}>¿Ya tenés cuenta? </Text>
        <Text style={styles.signInAccent}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* ── Background decor ── */}
      <View style={styles.bgDecor} pointerEvents="none">
        <Text style={styles.bgDecorText}>CLUB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['6'],
    justifyContent: 'center',
    gap: spacing.xxl,
  },

  /* ── Header ── */
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 3.2,
    marginBottom: spacing.sm,
  },
  headlineWhite: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplay,
    color: colors.onSurface,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
  },
  headlinePrimary: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplayItalic,
    color: colors.primary,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
    marginBottom: spacing.sm,
  },
  headerSub: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBody,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    maxWidth: '85%',
  },

  /* ── Disclaimer ── */
  disclaimer: {
    flexDirection: 'row',
    gap: spacing.base,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.ghostBorder,
  },
  disclaimerAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primaryContainer,
  },
  disclaimerText: {
    flex: 1,
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },

  /* ── Options ── */
  options: {
    gap: spacing.base,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.45,
  },
  optionButtonActive: {
    borderColor: colors.primaryContainer,
    backgroundColor: colors.surfaceContainerHigh,
    opacity: 1,
    ...shadows.float,
  },
  optionIcon: {
    fontSize: fonts.titleLg,
    color: colors.onSurfaceVariant,
    width: 28,
    textAlign: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: fonts.titleSm,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurfaceVariant,
  },
  optionLabelActive: {
    color: colors.onSurface,
  },
  badge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: fonts.familyBodyBold,
    color: colors.onPrimaryContainer,
    letterSpacing: 1.2,
  },

  /* ── Sign In Link ── */
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  signInText: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
  signInAccent: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
  },

  /* ── Background Decor ── */
  bgDecor: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: spacing.xxl,
    opacity: 0.04,
  },
  bgDecorText: {
    fontSize: 120,
    fontFamily: fonts.familyDisplayBlackItalic,
    color: colors.onSurfaceVariant,
    letterSpacing: -6,
    lineHeight: 120,
  },
});
