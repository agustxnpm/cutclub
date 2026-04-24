import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CheckCircle, XCircle, UserCheck } from 'lucide-react-native';
import { validarReferido } from '../services/clientesApi';
import { colors, spacing, radius, fonts } from '../styles/theme';

interface ValidarReferidoSheetProps {
  visible: boolean;
  clienteId: string;
  clienteNombre: string;
  referenteNombre: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ValidarReferidoSheet({
  visible,
  clienteId,
  clienteNombre,
  referenteNombre,
  onClose,
  onSuccess,
}: ValidarReferidoSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiales = clienteNombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  async function handleValidar(esNuevoReal: boolean) {
    setError(null);
    setIsLoading(true);
    try {
      await validarReferido(clienteId, esNuevoReal);
      onSuccess();
    } catch {
      setError('No se pudo validar el referido. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dimmed backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheetWrapper}>
        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <UserCheck size={22} color={colors.primary} strokeWidth={1.5} />
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Validación de referido</Text>
              <Text style={styles.titulo}>¿Cliente nuevo?</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initiales}</Text>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descCard}>
            <Text style={styles.descText}>
              <Text style={styles.descNombre}>{clienteNombre}</Text>
              {' fue referido por '}
              <Text style={styles.descNombre}>{referenteNombre ?? 'otro cliente'}</Text>
              {'. Confirmá si es su primera visita real a la barbería.'}
            </Text>
            <View style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>
                Si confirmás, el cliente que lo refirió recibe un{' '}
                <Text style={styles.ruleHighlight}>Corte Gratis</Text>.
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>
                Si rechazás, el referido se invalida y no se genera ningún beneficio.
              </Text>
            </View>
          </View>

          {/* Error */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnReject, isLoading && styles.actionBtnDisabled]}
              activeOpacity={0.8}
              onPress={() => handleValidar(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.onSurface} />
              ) : (
                <>
                  <XCircle size={18} color={colors.error} strokeWidth={1.5} />
                  <Text style={styles.actionBtnRejectText}>NO ES NUEVO</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnConfirm, isLoading && styles.actionBtnDisabled]}
              activeOpacity={0.85}
              onPress={() => handleValidar(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
              ) : (
                <>
                  <CheckCircle size={18} color={colors.onPrimaryContainer} strokeWidth={1.5} />
                  <Text style={styles.actionBtnConfirmText}>ES CLIENTE NUEVO →</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Skip */}
          <TouchableOpacity style={styles.skipBtn} onPress={onClose} activeOpacity={0.6}>
            <Text style={styles.skipText}>Validar más tarde</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════
   Styles
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['6'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 0.5,
    shadowRadius: 48,
    elevation: 24,
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
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.xxl,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(178, 197, 255, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(178, 197, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: 2,
  },
  titulo: {
    fontFamily: fonts.familyDisplay,
    fontSize: 28,
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
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

  /* Descripción */
  descCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  descText: {
    fontFamily: fonts.familyBody,
    fontSize: fonts.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: fonts.bodyMd * 1.6,
  },
  descNombre: {
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurface,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginTop: 7,
    flexShrink: 0,
  },
  ruleText: {
    flex: 1,
    fontFamily: fonts.familyBody,
    fontSize: fonts.bodySm,
    color: colors.onSurfaceVariant,
    lineHeight: fonts.bodySm * 1.6,
  },
  ruleHighlight: {
    fontFamily: fonts.familyBodySemiBold,
    color: colors.primary,
  },

  /* Error */
  errorText: {
    fontFamily: fonts.familyBody,
    fontSize: fonts.bodySm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  /* Actions */
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnReject: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 80, 0.30)',
  },
  actionBtnRejectText: {
    fontFamily: fonts.familyBodyBold,
    fontSize: fonts.labelMd,
    color: colors.error,
    letterSpacing: 0.8,
  },
  actionBtnConfirm: {
    backgroundColor: colors.primaryContainer,
  },
  actionBtnConfirmText: {
    fontFamily: fonts.familyBodyBold,
    fontSize: fonts.labelMd,
    color: colors.onPrimaryContainer,
    letterSpacing: 0.8,
  },

  /* Skip */
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontFamily: fonts.familyBodyMedium,
    fontSize: fonts.bodySm,
    color: colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
