import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts, radius } from '../styles/theme';

interface LoyaltyIndicatorProps {
  actual: number;
  meta: number;
}

export default function LoyaltyIndicator({ actual, meta }: LoyaltyIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: meta }, (_, i) => (
          <View key={i} style={[styles.dotShell, i < actual ? styles.dotShellActive : styles.dotShellInactive]}>
            <View
              style={[styles.dot, i < actual ? styles.dotActive : styles.dotInactive]}
            />
          </View>
        ))}
      </View>
      <View style={styles.captionRow}>
        <Text style={styles.label}>{actual} / {meta} cortes</Text>
        <Text style={styles.helper}>Progreso de fidelidad</Text>
      </View>
    </View>
  );
}

const DOT_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dotShell: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dotShellActive: {
    backgroundColor: colors.primaryHalo,
    borderColor: colors.ghostBorder,
  },
  dotShellInactive: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.ghostBorder,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  dotInactive: {
    backgroundColor: colors.outlineVariant,
  },
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fonts.bodyMd,
    color: colors.onSurfaceVariant,
    fontFamily: fonts.familyBodySemiBold,
  },
  helper: {
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBody,
    color: colors.outline,
  },
});
