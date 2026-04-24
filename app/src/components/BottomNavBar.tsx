import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, LogIn, LogOut } from 'lucide-react-native';
import { colors, spacing, fonts, radius } from '../styles/theme';

export type TabKey = 'clients' | 'cuenta';

interface BottomNavBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  /** 'login' cuando el barbero no tiene sesión de cliente activa; 'logout' cuando hay un cliente logueado */
  cuentaVariant: 'login' | 'logout';
}

export default function BottomNavBar({ activeTab, onTabPress, cuentaVariant }: BottomNavBarProps) {
  const tabs: { key: TabKey; label: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
    { key: 'clients', label: 'CLIENTES', Icon: Users },
    { key: 'cuenta',  label: cuentaVariant === 'logout' ? 'SALIR' : 'CUENTA', Icon: cuentaVariant === 'logout' ? LogOut : LogIn },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const { Icon } = tab;
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
