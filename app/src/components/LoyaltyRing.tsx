import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts, spacing, radius } from '../styles/theme';

interface LoyaltyRingProps {
  actual: number;
  meta: number;
  codigoReferido: string;
  /** Muestra el botón de compartir invitación por WhatsApp. Default: true */
  showShareInvite?: boolean;
}

const SIZE = 172;
const STROKE_BG = 4;
const STROKE_FG = 7;
const R = (SIZE - STROKE_FG) / 2;
const CIRC = 2 * Math.PI * R;

export default function LoyaltyRing({ actual, meta, codigoReferido, showShareInvite = true }: LoyaltyRingProps) {
  const progress = Math.min(actual / meta, 1);
  const offset = CIRC * (1 - progress);
  const remaining = meta - actual;
  const pct = Math.round(progress * 100);
  const [copied, setCopied] = useState(false);
  const copyBump = useRef(new Animated.Value(0)).current;

  const handleCopy = async () => {
    try {
      if (Platform.OS === 'web' && navigator?.clipboard) {
        await navigator.clipboard.writeText(codigoReferido);
      }
      Animated.sequence([
        Animated.timing(copyBump, { toValue: -4, duration: 80, useNativeDriver: true }),
        Animated.timing(copyBump, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShareWhatsApp = () => {
    const link = `https://cutclub.app/unirse?ref=${codigoReferido}`;
    const mensaje = `Unite a CutClub y arrancá con beneficios desde tu primer corte ${link}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Signature Halo: primary at 10% opacity, blurred */}
      <View style={styles.halo} />
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.outlineVariant + '1A'}
            strokeWidth={STROKE_BG}
            fill="transparent"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.primary}
            strokeWidth={STROKE_FG}
            fill="transparent"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringPct}>{pct}%</Text>
          <Text style={styles.ringLabel}>FIDELIDAD</Text>
        </View>
      </View>
      <View style={styles.ringInfo}>
        <Text style={styles.codeLabel}>CÓDIGO DE REFERIDO</Text>
        <View style={styles.codeActions}>
          <Animated.View style={{ transform: [{ translateY: copyBump }] }}>
            <TouchableOpacity onPress={handleCopy} activeOpacity={1} style={[styles.codeRow, copied && styles.codeRowCopied]}>
              <Text style={styles.clubCode}>{codigoReferido}</Text>
              <View style={[styles.copyBtn, copied && styles.copyBtnCopied]}>
                <Text style={[styles.copyLabel, copied && styles.copyLabelCopied]}>COPIAR</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          {showShareInvite && (
            <TouchableOpacity onPress={handleShareWhatsApp} activeOpacity={0.7} style={styles.wspBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill={colors.primary}>
                <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </Svg>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.cutsAway}>
          {remaining > 0
            ? `${remaining} corte${remaining > 1 ? 's' : ''} para beneficio`
            : 'Beneficio disponible'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    /* Tier: surfaceContainerLow against background — tonal shift = borderless */
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.xxl,
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
  },
  halo: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primaryGlow,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: {
    /* Display: Epilogue-style, tight tracking */
    fontSize: 38,
    fontFamily: fonts.familyDisplayBlack,
    color: colors.onSurface,
    letterSpacing: -1.5,
  },
  ringLabel: {
    /* Label: uppercase, wide tracking */
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    letterSpacing: 2.5,
    fontFamily: fonts.familyBodySemiBold,
    marginTop: 2,
  },
  ringInfo: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  clubCode: {
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  codeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.ghostBorder,
  },
  codeRowCopied: {
    borderColor: colors.success + '33',
  },
  copyBtn: {
    borderLeftWidth: 1,
    borderLeftColor: colors.ghostBorder,
    paddingLeft: spacing.base,
  },
  copyBtnCopied: {
    borderLeftColor: colors.success + '33',
  },
  copyLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  copyLabelCopied: {
    color: colors.success,
  },
  wspBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wspArrow: {
    position: 'absolute',
    top: 2,
    right: 3,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  cutsAway: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
});
