import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Menu } from 'lucide-react-native';
import { colors, spacing, fonts } from '../styles/theme';

export default function TopNavBar() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Menu size={24} color={colors.primary} strokeWidth={1.5} />
        <Text style={styles.brand}>CUTCLUB</Text>
      </View>
      <View style={styles.avatar}>
        <Image
          source={require('../../assets/poste-de-barbero.png')}
          style={styles.avatarImg}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    /* Glass card per DESIGN.md */
    backgroundColor: 'rgba(14, 14, 14, 0.80)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  brand: {
    fontSize: 24,
    fontFamily: fonts.familyDisplayBlackItalic,
    color: colors.onSurface,
    letterSpacing: -1.2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    /* Ghost border: outlineVariant at 20% */
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 30,
    height: 30,
  },
});
