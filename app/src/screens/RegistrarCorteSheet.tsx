import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Gift, Lock } from 'lucide-react-native';
import { META_CORTES_FIDELIDAD } from '../constants/fidelidad';
import { BeneficioResponse, canjearCorteGratis, registrarCorte } from '../services/clientesApi';
import { colors, spacing, radius, fonts } from '../styles/theme';

const SERVICIOS_RAPIDOS = [
  'Skin Fade',
  'Classic Cut',
  'Beard Trim',
  'Hot Towel Shave',
  'Shape Up',
];

interface RegistrarCorteSheetProps {
  visible: boolean;
  clienteId: string;
  clienteNombre: string;
  contadorFidelidad: number;
  beneficiosDisponibles?: BeneficioResponse[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrarCorteSheet({
  visible,
  clienteId,
  clienteNombre,
  contadorFidelidad,
  beneficiosDisponibles = [],
  onClose,
  onSuccess,
}: RegistrarCorteSheetProps) {
  const [tipoCorte, setTipoCorte] = useState('');
  const [precio, setPrecio] = useState('');
  const [chipSeleccionado, setChipSeleccionado] = useState<string | null>(null);
  const [usarBeneficio, setUsarBeneficio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beneficioActivo = beneficiosDisponibles[0] ?? null;
  const hayBeneficio = beneficioActivo !== null;

  const initiales = clienteNombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  const stampsCompletados = Math.min(contadorFidelidad, META_CORTES_FIDELIDAD);
  const precioNumerico = parseFloat(precio.replace(',', '.'));

  function handleChipPress(servicio: string) {
    if (chipSeleccionado === servicio) {
      setChipSeleccionado(null);
      setTipoCorte('');
    } else {
      setChipSeleccionado(servicio);
      setTipoCorte(servicio);
    }
  }

  function handleTipoCorteChange(text: string) {
    setTipoCorte(text);
    // Si el texto no coincide con el chip seleccionado, deseleccionarlo
    if (chipSeleccionado && text !== chipSeleccionado) {
      setChipSeleccionado(null);
    }
  }

  function handleClose() {
    setTipoCorte('');
    setPrecio('');
    setChipSeleccionado(null);
    setUsarBeneficio(false);
    setError(null);
    onClose();
  }

  async function handleSubmit() {
    setError(null);
    if (!tipoCorte.trim()) {
      setError('Seleccioná o escribí el tipo de servicio.');
      return;
    }
    if (!usarBeneficio && (isNaN(precioNumerico) || precioNumerico < 0)) {
      setError('Ingresá un precio válido.');
      return;
    }

    setIsLoading(true);
    try {
      if (usarBeneficio && beneficioActivo) {
        await canjearCorteGratis({
          clienteId,
          beneficioId: beneficioActivo.id,
          tipoCorte: tipoCorte.trim(),
        });
      } else {
        await registrarCorte({
          clienteId,
          tipoCorte: tipoCorte.trim(),
          precio: precioNumerico,
        });
      }
      handleClose();
      onSuccess();
    } catch {
      setError('No se pudo registrar el corte. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Dimmed backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Drag handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.eyebrow}>Nuevo corte</Text>
                <Text style={styles.clienteNombre}>{clienteNombre}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initiales}</Text>
              </View>
            </View>

            {/* Loyalty Stamps */}
            <View style={styles.loyaltyCard}>
              <Text style={styles.loyaltyLabel}>
                {stampsCompletados} / {META_CORTES_FIDELIDAD} VISITAS AL CORTE GRATIS
              </Text>
              <View style={styles.stampsRow}>
                {Array.from({ length: META_CORTES_FIDELIDAD }).map((_, i) => {
                  const filled = i < stampsCompletados;
                  return (
                    <View
                      key={i}
                      style={[styles.stamp, filled ? styles.stampFilled : styles.stampEmpty]}
                    >
                      <Text style={[styles.stampIcon, filled ? styles.stampIconFilled : styles.stampIconEmpty]}>
                        ✂
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Banner: Corte Gratis disponible */}
            {hayBeneficio && (
              <TouchableOpacity
                style={[styles.beneficioBanner, usarBeneficio && styles.beneficioBannerActive]}
                activeOpacity={0.8}
                onPress={() => setUsarBeneficio((v) => !v)}
              >
                <View style={styles.beneficioIconWrap}>
                  <Gift size={18} color={usarBeneficio ? colors.onPrimaryContainer : colors.primary} strokeWidth={1.5} />
                </View>
                <View style={styles.beneficioCopy}>
                  <Text style={[styles.beneficioTitle, usarBeneficio && styles.beneficioTitleActive]}>
                    Corte Gratis disponible
                  </Text>
                  <Text style={[styles.beneficioSub, usarBeneficio && styles.beneficioSubActive]}>
                    {usarBeneficio ? 'Activo — precio $0.00' : 'Toc\u00e1 para aplicar el beneficio'}
                  </Text>
                </View>
                <View style={[styles.beneficioToggle, usarBeneficio && styles.beneficioToggleActive]}>
                  <View style={[styles.beneficioToggleThumb, usarBeneficio && styles.beneficioToggleThumbActive]} />
                </View>
              </TouchableOpacity>
            )}

            {/* Service Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TIPO DE SERVICIO</Text>
              <TextInput
                style={styles.input}
                value={tipoCorte}
                onChangeText={handleTipoCorteChange}
                placeholder="ej. Skin Fade, Beard Trim"
                placeholderTextColor={colors.inverseOnSurface}
                selectionColor={colors.primary}
              />
              {/* Quick chips */}
              <View style={styles.chipsWrap}>
                {SERVICIOS_RAPIDOS.map((s) => {
                  const activo = chipSeleccionado === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[styles.chip, activo && styles.chipActive]}
                      activeOpacity={0.75}
                      onPress={() => handleChipPress(s)}
                    >
                      <Text style={[styles.chipText, activo && styles.chipTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price */}
            <View style={[styles.priceCard, usarBeneficio && styles.priceCardFree]}>
              <View style={styles.priceRow}>
                <Text style={styles.fieldLabel}>TOTAL COBRADO</Text>
                {usarBeneficio ? (
                  <Text style={styles.priceInputFree}>$0.00</Text>
                ) : (
                  <TextInput
                    style={styles.priceInput}
                    value={precio}
                    onChangeText={setPrecio}
                    placeholder="0.00"
                    placeholderTextColor={colors.inverseOnSurface}
                    keyboardType="decimal-pad"
                    selectionColor={colors.primary}
                  />
                )}
              </View>
              <Text style={styles.priceNote}>
                {usarBeneficio
                  ? 'Beneficio aplicado — este corte no tiene costo.'
                  : 'Los cortes gratis son aplicados autom\u00e1ticamente por el sistema.'}
              </Text>
            </View>

            {/* Error */}
            {error && <Text style={styles.errorText}>{error}</Text>}

          </ScrollView>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <View style={styles.halo} pointerEvents="none" />
            <TouchableOpacity
              style={[styles.ctaBtn, isLoading && styles.ctaBtnDisabled, usarBeneficio && styles.ctaBtnFree]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.onPrimaryContainer} />
              ) : (
                <Text style={styles.ctaText}>
                  {usarBeneficio ? 'CANJEAR CORTE GRATIS →' : 'REGISTRAR CORTE →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════
   Styles — Dark Barber Editorial Design System
   ═══════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 0.5,
    shadowRadius: 48,
    elevation: 24,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.base,
  },

  /* Drag handle */
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.xxl,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.base,
  },
  eyebrow: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: spacing.xs,
  },
  clienteNombre: {
    fontFamily: fonts.familyDisplay,
    fontSize: 32,
    color: colors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.familyDisplay,
    fontSize: fonts.titleMd,
    color: colors.onSurface,
  },

  /* Loyalty */
  loyaltyCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  loyaltyLabel: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  stampsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stamp: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampFilled: {
    backgroundColor: 'rgba(178, 197, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(178, 197, 255, 0.35)',
  },
  stampEmpty: {
    backgroundColor: colors.surfaceContainerHighest,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
  },
  stampIcon: {
    fontSize: 18,
  },
  stampIconFilled: {
    color: colors.primary,
  },
  stampIconEmpty: {
    color: colors.outlineVariant,
    opacity: 0.5,
  },

  /* Form */
  fieldGroup: {
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  fieldLabel: {
    fontFamily: fonts.familyBodySemiBold,
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.ghostBorder,
    color: colors.onSurface,
    fontFamily: fonts.familyBody,
    fontSize: fonts.bodyLg,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.20)',
  },
  chipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  chipText: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.bodySm,
    color: colors.onSurface,
  },
  chipTextActive: {
    color: colors.onPrimaryContainer,
  },

  /* Price */
  priceCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.base,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.20)',
  },
  priceCardFree: {
    borderColor: 'rgba(178, 197, 255, 0.25)',
    backgroundColor: 'rgba(178, 197, 255, 0.05)',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  priceInput: {
    fontFamily: fonts.familyDisplay,
    fontSize: 36,
    color: colors.onSurface,
    textAlign: 'right',
    letterSpacing: -1,
    minWidth: 120,
    padding: 0,
  },
  priceInputFree: {
    fontFamily: fonts.familyDisplay,
    fontSize: 36,
    color: colors.primary,
    textAlign: 'right',
    letterSpacing: -1,
    minWidth: 120,
    padding: 0,
  },
  priceNote: {
    fontFamily: fonts.familyBody,
    fontSize: 11,
    color: colors.inverseOnSurface,
    lineHeight: 16,
  },

  /* Beneficio banner */
  beneficioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.base,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(178, 197, 255, 0.15)',
  },
  beneficioBannerActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: 'rgba(178, 197, 255, 0.40)',
  },
  beneficioIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(178, 197, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficioCopy: {
    flex: 1,
  },
  beneficioTitle: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.bodyMd,
    color: colors.onSurface,
    marginBottom: 2,
  },
  beneficioTitleActive: {
    color: colors.onPrimaryContainer,
  },
  beneficioSub: {
    fontFamily: fonts.familyBody,
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
  },
  beneficioSubActive: {
    color: 'rgba(192, 207, 255, 0.75)',
  },
  beneficioToggle: {
    width: 40,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  beneficioToggleActive: {
    backgroundColor: 'rgba(178, 197, 255, 0.35)',
  },
  beneficioToggleThumb: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.inverseOnSurface,
  },
  beneficioToggleThumbActive: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },

  /* Error */
  errorText: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.bodyMd,
    color: colors.error,
    marginBottom: spacing.sm,
  },

  /* CTA */
  ctaContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.base,
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-60%',
    width: '120%',
    height: 128,
    backgroundColor: 'transparent',
    // Halo via shadowColor simula el glow radial del prototipo
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 60,
    elevation: 0,
  },
  ctaBtn: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnFree: {
    backgroundColor: 'rgba(178, 197, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(178, 197, 255, 0.40)',
  },
  ctaBtnDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontFamily: fonts.familyDisplay,
    fontSize: fonts.bodyLg,
    color: colors.onPrimaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  secureText: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: 10,
    color: colors.inverseOnSurface,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
