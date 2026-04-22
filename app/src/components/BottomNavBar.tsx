import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Store, Users, CalendarDays, Sparkles } from 'lucide-react-native';
import { colors, spacing, fonts, radius } from '../styles/theme';

export type TabKey = 'shop' | 'clients' | 'bookings' | 'vip';

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

const TAB_ICONS: Record<TabKey, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  shop: Store,
  clients: Users,
  bookings: CalendarDays,
  vip: Sparkles,
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'shop',     label: 'SHOP' },
  { key: 'clients',  label: 'CLIENTES' },
  { key: 'bookings', label: 'TURNOS' },
  { key: 'vip',      label: 'VIP' },
];

export default function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        const Icon = TAB_ICONS[tab.key];
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Icon size={20} color={active ? colors.primary : colors.onSurfaceVariant} strokeWidth={1.5} />
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    /* Glass card — no border-top line per "No-Line" rule */
    backgroundColor: 'rgba(14, 14, 14, 0.90)',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    gap: 4,
  },
  tabActive: {
    /* Signature Halo: primary at 10% */
    backgroundColor: colors.primaryHalo,
  },
  label: {
    /* Label: uppercase, +0.05em tracking */
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyMedium,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.primary,
    fontFamily: fonts.familyBodySemiBold,
  },
});
