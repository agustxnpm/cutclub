import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Linking,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ArrowLeft, Star, Sparkles, Lock, Scissors } from 'lucide-react-native';
import { META_CORTES_FIDELIDAD } from '../constants/fidelidad';
import { obtenerPerfilCliente, PerfilClienteResponse } from '../services/clientesApi';
import LoyaltyRing from '../components/LoyaltyRing';
import RegistrarCorteSheet from './RegistrarCorteSheet';
import ValidarReferidoSheet from './ValidarReferidoSheet';
import { useRol } from '../context/RolContext';
import { colors, spacing, fonts, radius, shadows } from '../styles/theme';

interface PerfilClienteScreenProps {
  clienteId: string;
  onBack: () => void;
}

/* ─── Static data for sections without backend support ─── */

export default function PerfilClienteScreen({ clienteId, onBack }: PerfilClienteScreenProps) {
  const [perfil, setPerfil] = useState<PerfilClienteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalCorteVisible, setModalCorteVisible] = useState(false);
  const [modalValidarVisible, setModalValidarVisible] = useState(false);
  const [historialExpandido, setHistorialExpandido] = useState(false);
  const contactScale = useRef(new Animated.Value(1)).current;
  const { rol } = useRol();

  const cargarPerfil = () => {
    setIsLoading(true);
    setError(false);
    obtenerPerfilCliente(clienteId)
      .then((data) => setPerfil(data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    cargarPerfil();
  }, [clienteId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !perfil) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
        <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}>
          <View style={styles.navBtnInner}>
            <ArrowLeft size={16} color={colors.onSurface} strokeWidth={1.5} />
            <Text style={styles.navBtnText}>Volver</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const formatFecha = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const nameParts = perfil.nombre.split(' ');

  const handleContactarWhatsApp = () => {
    const normalized = perfil.telefono.replace(/[^\d]/g, '');
    Linking.openURL(`https://wa.me/${normalized}`);
  };

  const handleContactarPress = () => {
    Animated.sequence([
      Animated.timing(contactScale, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(contactScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      handleContactarWhatsApp();
    });
  };

  // TODO: Usar rol real del usuario autenticado
  const isBarbero = rol === 'barbero';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Navigation ── */}
        <TouchableOpacity style={styles.navBtn} onPress={onBack} activeOpacity={0.7}>
          <View style={styles.navBtnInner}>
            <ArrowLeft size={16} color={colors.onSurface} strokeWidth={1.5} />
            <Text style={styles.navBtnText}>Volver</Text>
          </View>
        </TouchableOpacity>

        {/* ════════════════════════════════════════
            HERO — Editorial asymmetric layout
            Display typography, expansive negative space
           ════════════════════════════════════════ */}
        <View style={styles.heroSection}>
          <Text style={styles.eyebrow}>Perfil cliente</Text>
          <Text style={styles.heroName}>
            {nameParts.map((p, i) => (
              <Text key={i}>{p}{i < nameParts.length - 1 ? '\n' : ''}</Text>
            ))}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>TELÉFONO</Text>
              <Text style={styles.metaValue}>{perfil.telefono}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>MIEMBRO DESDE</Text>
              <Text style={styles.metaValue}>2024</Text>
            </View>
          </View>

          {/* TODO: Mostrar solo cuando el rol sea 'barbero' (actualmente hardcodeado) */}
          {isBarbero && (
            <View style={styles.barberóActions}>
              <TouchableOpacity
                style={styles.registrarCorteBtn}
                activeOpacity={0.85}
                onPress={() => setModalCorteVisible(true)}
              >
                <Text style={styles.registrarCorteBtnText}>REGISTRAR CORTE →</Text>
              </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: contactScale }] }}>
              <TouchableOpacity
                style={styles.contactarBtn}
                activeOpacity={1}
                onPress={handleContactarPress}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill={colors.onSurfaceVariant}>
                <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </Svg>
              <Text style={styles.contactarText}>CONTACTAR</Text>
              </TouchableOpacity>
            </Animated.View>
            </View>
          )}
        </View>

        {/* ════════════════════════════════════════
            LOYALTY RING — surfaceContainerLow tier
           ════════════════════════════════════════ */}
        {/* Callout: referido pendiente de validación (solo barbero) */}
        {isBarbero && perfil.esReferidoPendiente && (
          <TouchableOpacity
            style={styles.referidoCallout}
            activeOpacity={0.8}
            onPress={() => setModalValidarVisible(true)}
          >
            <View style={styles.referidoCalloutDot} />
            <View style={styles.referidoCalloutCopy}>
              <Text style={styles.referidoCalloutTitle}>VALIDACIÓN PENDIENTE</Text>
              <Text style={styles.referidoCalloutSub}>
                Este cliente fue referido. Confirmá si es nuevo para liberar el beneficio.
              </Text>
            </View>
            <Text style={styles.referidoCalloutArrow}>→</Text>
          </TouchableOpacity>
        )}

        <LoyaltyRing
          actual={perfil.contadorFidelidad}
          meta={META_CORTES_FIDELIDAD}
          codigoReferido={perfil.codigoReferido}
          showShareInvite={!isBarbero}
        />

        {/* ════════════════════════════════════════
            ACTIVE REWARDS — Bento card
            No dividers, spacing-based separation
           ════════════════════════════════════════ */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Text style={styles.rewardsTitle}>Beneficios Activos</Text>
            <Star size={16} color={colors.primary} strokeWidth={1.5} />
          </View>

          {perfil.beneficiosDisponibles.length > 0 ? (
            <View style={styles.rewardsGrid}>
              {perfil.beneficiosDisponibles.map((b) => (
                <View key={b.id} style={styles.rewardPill}>
                  <View style={styles.rewardIconWrap}>
                    <Sparkles size={14} color={colors.primary} strokeWidth={1.5} />
                  </View>
                  <View style={styles.rewardCopy}>
                    <Text style={styles.rewardName}>Corte gratis</Text>
                    <Text style={styles.rewardSub}>{b.descripcionOrigen}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.rewardsGrid}>
              <View style={[styles.rewardPill, styles.rewardLocked]}>
                <View style={styles.rewardIconLocked}>
                  <Lock size={14} color={colors.outline} strokeWidth={1.5} />
                </View>
                <View style={styles.rewardCopy}>
                  <Text style={styles.rewardNameLocked}>Corte gratis</Text>
                  <Text style={styles.rewardSubLocked}>Bloqueado</Text>
                </View>
              </View>
              <View style={[styles.rewardPill, styles.rewardLocked]}>
                <View style={styles.rewardIconLocked}>
                  <Lock size={14} color={colors.outline} strokeWidth={1.5} />
                </View>
                <View style={styles.rewardCopy}>
                  <Text style={styles.rewardNameLocked}>Beneficio referido</Text>
                  <Text style={styles.rewardSubLocked}>Bloqueado</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ════════════════════════════════════════
            LAST CUT — Primary container card
            "Surgical strike" use of primary color
           ════════════════════════════════════════ */}
        <View style={styles.lastCutCard}>
          <View style={styles.lastCutWatermark}>
            <Scissors size={48} color={colors.onSurfaceVariant} strokeWidth={1} />
          </View>
          <View style={styles.lastCutContent}>
            <Text style={styles.lastCutTitle}>Ultima Visita</Text>

            {perfil.ultimoCorte ? (
              <View style={styles.lastCutBody}>
                <View style={styles.lastCutField}>
                  <Text style={styles.lastCutLabel}>SERVICIO</Text>
                  <Text style={styles.lastCutValue}>{perfil.ultimoCorte.tipoCorte}</Text>
                </View>
                <View style={styles.lastCutFieldRow}>
                  <View style={styles.lastCutField}>
                    <Text style={styles.lastCutLabel}>FECHA</Text>
                    <Text style={styles.lastCutValueSm}>{formatFecha(perfil.ultimoCorte.fecha)}</Text>
                  </View>
                  <View style={styles.lastCutField}>
                    <Text style={styles.lastCutLabel}>PRECIO</Text>
                    <Text style={styles.lastCutValueSm}>${perfil.ultimoCorte.precio.toFixed(2)}</Text>
                  </View>
                </View>
                {perfil.ultimoCorte.esGratis && (
                  <View style={styles.lastCutField}>
                    <Text style={styles.lastCutLabel}>TIPO</Text>
                    <Text style={styles.lastCutValueSm}>Corte gratis</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.lastCutEmpty}>Sin cortes registrados.</Text>
            )}
          </View>
        </View>

        {/* ════════════════════════════════════════
            SERVICE TIMELINE
            Editorial list with date blocks
           ════════════════════════════════════════ */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeadline}>Historial de Servicios</Text>

          <View style={styles.timelineList}>
            {perfil.historialCortes.length === 0 ? (
              <Text style={styles.timelineNotes}>Sin cortes registrados aún.</Text>
            ) : (
              (historialExpandido ? perfil.historialCortes : perfil.historialCortes.slice(0, 3)).map((corte) => (
                <View key={corte.id} style={styles.timelineItem}>
                  <View style={styles.timelineDateBox}>
                    <Text style={styles.timelineDateDay}>
                      {(() => { const d = new Date(corte.fecha); return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`; })()}
                    </Text>
                    <Text style={styles.timelineDateYear}>{new Date(corte.fecha).getFullYear()}</Text>
                  </View>
                  <View style={styles.timelineCopy}>
                    <Text style={styles.timelineService}>{corte.tipoCorte}</Text>
                    {corte.esGratis && (
                      <Text style={styles.timelineNotes}>Corte gratis</Text>
                    )}
                  </View>
                  <View style={styles.timelineRight}>
                    <Text style={styles.timelinePriceLabel}>PRECIO</Text>
                    <Text style={styles.timelinePrice}>
                      {corte.esGratis ? 'GRATIS' : `$${Number(corte.precio).toFixed(2)}`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Secondary button: ghost style per DESIGN.md */}
          {perfil.historialCortes.length > 3 && (
            <TouchableOpacity style={styles.historyBtn} activeOpacity={0.7} onPress={() => setHistorialExpandido(prev => !prev)}>
              <Text style={styles.historyBtnText}>
                {historialExpandido ? 'OCULTAR HISTORIAL' : 'VER HISTORIAL COMPLETO'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>

      {perfil && (
        <RegistrarCorteSheet
          visible={modalCorteVisible}
          clienteId={perfil.id}
          clienteNombre={perfil.nombre}
          contadorFidelidad={perfil.contadorFidelidad}
          beneficiosDisponibles={perfil.beneficiosDisponibles}
          onClose={() => setModalCorteVisible(false)}
          onSuccess={() => {
            setModalCorteVisible(false);
            // Si el referido estaba pendiente antes del corte, disparar validación
            if (perfil.esReferidoPendiente) {
              setModalValidarVisible(true);
            }
            cargarPerfil();
          }}
        />
      )}

      {perfil && (
        <ValidarReferidoSheet
          visible={modalValidarVisible}
          clienteId={perfil.id}
          clienteNombre={perfil.nombre}
          referenteNombre={perfil.nombreReferente}
          onClose={() => setModalValidarVisible(false)}
          onSuccess={() => {
            setModalValidarVisible(false);
            cargarPerfil();
          }}
        />
      )}
    </View>
  );
}

/* ═══════════════════════════════════════════════════
   Styles — Dark Barber Editorial Design System
   ═══════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['6'],
    gap: spacing.xxl, /* Spacing 6 (2rem) between sections — embrace negative space */
  },

  /* ── Navigation ── */
  navBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    /* Ghost border per DESIGN.md */
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ghostBorder,
  },
  navBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navBtnText: {
    color: colors.onSurface,
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodySemiBold,
  },

  /* ── Hero — Editorial asymmetric layout ── */
  heroSection: {
    gap: spacing.lg,
  },
  eyebrow: {
    /* Label: uppercase, +0.05em tracking, primary as surgical strike */
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBodyBold,
    textTransform: 'uppercase',
    letterSpacing: 3.2,
    color: colors.primary,
  },
  heroName: {
    /* Display-lg: 3.5rem, Epilogue-style, tight tracking */
    fontSize: fonts.displayLg,
    fontFamily: fonts.familyDisplayBlack,
    color: colors.onSurface,
    letterSpacing: -2,
    lineHeight: fonts.displayLg * 0.95,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  metaBlock: {
    gap: 2,
  },
  metaLabel: {
    /* Label: uppercase, wide tracking */
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    letterSpacing: 2.5,
    fontFamily: fonts.familyBodyMedium,
    textTransform: 'uppercase',
  },
  metaValue: {
    /* Headline-style: bold, high-weight on dark bg */
    fontSize: fonts.titleLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  metaDivider: {
    width: 1,
    height: 36,
    /* Ghost border color for dividers */
    backgroundColor: colors.ghostBorder,
  },

  /* ── Acciones del barbero ── */
  barberóActions: {
    gap: spacing.sm,
  },
  registrarCorteBtn: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  registrarCorteBtnText: {
    fontFamily: fonts.familyDisplay,
    fontSize: fonts.bodyLg,
    color: colors.onPrimaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  /* ── Contactar WhatsApp (barbero) ── */
  contactarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  contactarText: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Callout: referido pendiente de validación ── */
  referidoCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    backgroundColor: 'rgba(178, 197, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(178, 197, 255, 0.22)',
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  referidoCalloutDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  referidoCalloutCopy: {
    flex: 1,
    gap: 4,
  },
  referidoCalloutTitle: {
    fontFamily: fonts.familyBodyBold,
    fontSize: fonts.labelSm,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  referidoCalloutSub: {
    fontFamily: fonts.familyBody,
    fontSize: fonts.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: fonts.bodySm * 1.5,
  },
  referidoCalloutArrow: {
    fontFamily: fonts.familyBodyBold,
    fontSize: fonts.titleMd,
    color: colors.primary,
  },

  /* ── Rewards card ── */
  rewardsCard: {
    /* Tier 2 vs background: tonal shift = borderless containment */
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.xl,
    borderRadius: radius.lg,
    /* Spacing 6 (2rem) between internal groups */
    gap: spacing.xxl,
  },
  rewardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardsTitle: {
    /* Headline: bold, tight tracking */
    fontSize: fonts.headlineSm,
    fontFamily: fonts.familyDisplay,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  rewardsAccent: {
    fontSize: fonts.headlineSm,
    color: colors.primary,
  },
  rewardsGrid: {
    /* 12px vertical gap instead of dividers */
    gap: spacing.md,
  },
  rewardPill: {
    /* Nested surface: surfaceContainerHigh inside surfaceContainerLow */
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.lg,
    borderRadius: radius.md, /* Inner: md (0.75rem) */
    /* Ghost border on edge */
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  rewardLocked: {
    opacity: 0.4,
    borderColor: 'transparent',
  },
  rewardIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    /* Service Chip: secondary_container-like */
    backgroundColor: 'rgba(0, 64, 161, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIconText: {
    fontSize: fonts.titleMd,
    color: colors.primary,
  },
  rewardIconLocked: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.outlineVariant + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardIconLockedText: {
    fontSize: fonts.bodyLg,
    color: colors.onSurfaceVariant,
  },
  rewardCopy: {
    flex: 1,
    gap: 2,
  },
  rewardName: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  rewardNameLocked: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurfaceVariant,
  },
  rewardSub: {
    /* Label: small, uppercase implied by content */
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
  rewardSubLocked: {
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBody,
    color: colors.outline,
  },

  /* ── Last Cut — Primary container ── */
  lastCutCard: {
    /* "Surgical strike": primary container as accent card */
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  lastCutWatermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: spacing.base,
    opacity: 0.07,
  },
  lastCutWatermarkText: {
    fontSize: 110,
    color: colors.onPrimaryContainer,
  },
  lastCutContent: {
    gap: spacing.xxl,
  },
  lastCutTitle: {
    fontSize: fonts.headlineSm,
    fontFamily: fonts.familyDisplay,
    color: colors.onPrimaryContainer,
    letterSpacing: -0.5,
  },
  lastCutBody: {
    gap: spacing.xl,
  },
  lastCutField: {
    gap: 3,
  },
  lastCutLabel: {
    fontSize: fonts.labelSm,
    letterSpacing: 2.5,
    color: colors.onPrimaryContainer,
    opacity: 0.55,
    fontFamily: fonts.familyBodyMedium,
    textTransform: 'uppercase',
  },
  lastCutValue: {
    fontSize: fonts.titleLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onPrimaryContainer,
  },
  lastCutValueSm: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onPrimaryContainer,
  },
  lastCutFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lastCutEmpty: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBody,
    color: colors.onPrimaryContainer,
    opacity: 0.6,
  },

  /* ── Timeline ── */
  timelineSection: {
    gap: spacing.lg,
  },
  timelineHeadline: {
    /* Headline: bold, tight tracking per DESIGN.md */
    fontSize: fonts.headlineMd,
    fontFamily: fonts.familyDisplay,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  timelineList: {
    /* 12px gap between items instead of dividers */
    gap: spacing.md,
  },
  timelineItem: {
    /* surfaceContainerLow against background — tonal shift */
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  timelineDateBox: {
    width: 58,
    height: 52,
    /* surfaceContainerHighest nested inside surfaceContainerLow */
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  timelineDateDay: {
    fontSize: fonts.bodySm,
    fontFamily: fonts.familyDisplayBlack,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  timelineDateYear: {
    fontSize: 10,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
    opacity: 0.6,
    lineHeight: 12,
  },
  timelineCopy: {
    flex: 1,
    gap: 3,
  },
  timelineService: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  timelineNotes: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
  timelineRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  timelinePriceLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  timelinePrice: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  /* Secondary button: ghost style */
  historyBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xxl,
    /* Ghost border */
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    borderRadius: radius.md,
  },
  historyBtnText: {
    /* Tertiary text: Inter Bold, uppercase, 0.05em tracking */
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Misc ── */
  errorText: {
    color: colors.error,
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBody,
  },
});
