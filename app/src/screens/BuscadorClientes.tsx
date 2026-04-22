import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Search, Plus, UserPlus } from 'lucide-react-native';
import { META_CORTES_FIDELIDAD } from '../constants/fidelidad';
import { listarClientes, ClienteResponse } from '../services/clientesApi';
import { colors, spacing, radius, fonts, shadows } from '../styles/theme';

interface BuscadorClientesProps {
  onSelectCliente: (clienteId: string) => void;
  onNuevoCliente?: () => void;
}

/* ─── Helpers ─── */
function getStatusLabel(fidelidad: number): { text: string; isVip: boolean } {
  return fidelidad >= META_CORTES_FIDELIDAD
    ? { text: 'VIP', isVip: true }
    : { text: 'ACTIVO', isVip: false };
}

function progressPercent(fidelidad: number): number {
  return Math.min((fidelidad / META_CORTES_FIDELIDAD) * 100, 100);
}

function openWhatsApp(telefono: string) {
  const normalized = telefono.replace(/[^\d]/g, '');
  Linking.openURL(`https://wa.me/${normalized}`);
}

/* ═══════════════════════════════════════════════════
   Component: Client Directory
   Replicates code.html Bento-style editorial layout
   ═══════════════════════════════════════════════════ */

export default function BuscadorClientes({ onSelectCliente, onNuevoCliente }: BuscadorClientesProps) {
  const [query, setQuery] = useState('');
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  /* Load all clients on mount */
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    listarClientes()
      .then((data) => { if (!cancelled) setClientes(data); })
      .catch(() => { if (!cancelled) setClientes([]); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, []);

  /* Filter locally */
  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.telefono.includes(q),
    );
  }, [query, clientes]);

  /* ─── Bento Card ─── */
  const renderItem = ({ item }: { item: ClienteResponse }) => {
    const status = getStatusLabel(item.contadorFidelidad);
    const progress = progressPercent(item.contadorFidelidad);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.82}
        onPress={() => onSelectCliente(item.id)}
      >
        {/* Top: Avatar + Info + Badge */}
        <View style={styles.cardHeader}>
          <View style={styles.cardIdentity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {item.nombre.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{item.nombre}</Text>
              <View style={styles.phoneRow}>
                <Text style={styles.cardPhone}>{item.telefono}</Text>
            
              </View>
            </View>
          </View>
          <View style={[styles.badge, status.isVip ? styles.badgeVip : styles.badgeActive]}>
            <Text style={[styles.badgeText, status.isVip ? styles.badgeTextVip : styles.badgeTextActive]}>
              {status.text}
            </Text>
          </View>
        </View>

        {/* Bottom: Loyalty progress */}
        <View style={styles.cardBottom}>
          <View style={styles.loyaltyMeta}>
            <Text style={styles.loyaltyLabel}>Progreso de fidelidad</Text>
            <Text style={[styles.loyaltyCount, status.isVip && styles.loyaltyCountVip]}>
              {item.contadorFidelidad}/{META_CORTES_FIDELIDAD} Visitas
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                status.isVip && styles.progressFillVip,
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* ════════════════════════════════════════
                EDITORIAL HEADER — stacked headline
               ════════════════════════════════════════ */}
            <View style={styles.editorialHeader}>
              <Text style={styles.headlineWhite}>DIRECTORIO</Text>
              <Text style={styles.headlinePrimary}>DE CLIENTES</Text>
              <Text style={styles.headerSub}>
                Consulta tus clientes acá.
              </Text>

              {onNuevoCliente && (
                <TouchableOpacity
                  style={styles.ctaPrimary}
                  onPress={onNuevoCliente}
                  activeOpacity={0.82}
                >
                  <UserPlus size={16} color={colors.onPrimaryContainer} strokeWidth={1.5} />
                  <Text style={styles.ctaLabel}>REGISTRAR NUEVO CLIENTE</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ════════════════════════════════════════
                PROTAGONIST SEARCH BAR
               ════════════════════════════════════════ */}
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <Search size={18} color={searchFocused ? colors.primary : colors.onSurfaceVariant} strokeWidth={1.5} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={'BUSCAR NOMBRE O TEL...'}
                  placeholderTextColor={colors.onSurfaceVariant + '4D'}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={[
                styles.searchBorder,
                searchFocused && styles.searchBorderFocused,
              ]} />
            </View>

            {/* Loading state */}
            {isLoading && (
              <View style={styles.loaderWrap}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            )}

            {/* No results for filter */}
            {!isLoading && filtrados.length === 0 && query.trim().length >= 2 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptyCopy}>
                  Proba con otro nombre, un telefono parcial o registra un cliente nuevo.
                </Text>
              </View>
            )}

            {/* Results count */}
            {!isLoading && filtrados.length > 0 && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {filtrados.length} {filtrados.length === 1 ? 'cliente' : 'clientes'}
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          /* ════════════════════════════════════════
             ADD NEW CLIENT — skeleton card
             ════════════════════════════════════════ */
          !isLoading && onNuevoCliente ? (
            <TouchableOpacity
              style={styles.addCard}
              activeOpacity={0.72}
              onPress={onNuevoCliente}
            >
              <View style={styles.addIconCircle}>
                <Plus size={20} color={colors.primary} strokeWidth={1.5} />
              </View>
              <Text style={styles.addLabel}>AGREGAR NUEVO CLIENTE</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

/* ═══════════════════════════════════════════════════
   Styles — Dark Barber Editorial / Client Directory
   Replicates code.html Bento layout per DESIGN.md
   ═══════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing['6'],
    gap: spacing.lg,
  },

  /* ── Editorial Header ── */
  editorialHeader: {
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  headlineWhite: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplay,
    color: colors.onSurface,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
    textTransform: 'uppercase',
  },
  headlinePrimary: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplayItalic,
    color: colors.primary,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
    textTransform: 'uppercase',
  },
  headerSub: {
    fontSize: fonts.bodyLg,
    fontFamily: fonts.familyBody,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    maxWidth: 320,
    marginTop: spacing.sm,
  },
  ctaPrimary: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.sm,
    ...shadows.float,
  },
  ctaIcon: {
    fontSize: fonts.titleMd,
    color: colors.onPrimaryContainer,
    fontWeight: '300',
  },
  ctaLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    color: colors.onPrimaryContainer,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Protagonist Search Bar ── */
  searchSection: {
    marginBottom: spacing.xxl,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.base,
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
  },
  searchIcon: {
    fontSize: fonts.headlineSm,
    color: colors.onSurfaceVariant,
  },
  searchIconFocused: {
    color: colors.primary,
  },
  searchInput: {
    flex: 1,
    /* Large headline-style input */
    fontSize: fonts.titleLg,
    fontFamily: fonts.familyBodySemiBold,
    letterSpacing: -0.3,
    color: colors.onSurface,
    paddingVertical: spacing.xxl,
    paddingRight: spacing.base,
  },
  searchBorder: {
    height: 2,
    backgroundColor: colors.ghostBorder,
  },
  searchBorderFocused: {
    backgroundColor: colors.primary,
  },

  /* ── States ── */
  loaderWrap: {
    paddingVertical: spacing['6'],
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    gap: spacing.sm,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  emptyCopy: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  resultsHeader: {
    paddingBottom: spacing.xs,
  },
  resultsCount: {
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },

  /* ── Bento Client Card ── */
  card: {
    /* Tier 2: surface-container-high for interactive cards */
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.xl,
    /* Ghost border per DESIGN.md */
    borderWidth: 1,
    borderColor: colors.surfaceBright + '33',
    /* Ambient shadow: felt not seen */
    ...shadows.ambient,
    justifyContent: 'space-between',
    minHeight: 220,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIdentity: {
    flexDirection: 'row',
    gap: spacing.base,
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: fonts.headlineSm,
    fontFamily: fonts.familyDisplayBlack,
    color: colors.onSurfaceVariant,
  },
  cardInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  cardName: {
    /* Headline bold: editorial card title */
    fontSize: fonts.titleLg,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  cardPhone: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wspBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: colors.outlineVariant + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Status Badge */
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    marginLeft: spacing.sm,
  },
  badgeVip: {
    backgroundColor: 'rgba(0, 64, 161, 0.20)',
    borderColor: 'rgba(178, 197, 255, 0.20)',
  },
  badgeActive: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.ghostBorder,
  },
  badgeText: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  badgeTextVip: {
    color: colors.primary,
  },
  badgeTextActive: {
    color: colors.onSecondaryContainer,
  },

  /* Card Bottom: Loyalty Progress */
  cardBottom: {
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  loyaltyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  loyaltyLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loyaltyCount: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  loyaltyCountVip: {
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.onSurfaceVariant + '66',
    borderRadius: radius.full,
  },
  progressFillVip: {
    backgroundColor: colors.primary,
  },

  /* ── Add New Client Skeleton Card ── */
  addCard: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.ghostBorder,
    borderStyle: 'dashed',
    paddingVertical: spacing['6'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
    minHeight: 180,
  },
  addIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.ghostBorder,
  },
  addIconPlus: {
    fontSize: fonts.headlineSm,
    fontWeight: '300',
    color: colors.primary,
  },
  addLabel: {
    fontSize: fonts.labelMd,
    fontFamily: fonts.familyBodyBold,
    letterSpacing: 2.5,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
});
