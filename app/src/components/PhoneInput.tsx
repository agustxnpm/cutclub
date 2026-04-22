import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import { colors, spacing, radius, fonts } from '../styles/theme';

interface CountryCode {
  name: string;
  dial: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { name: 'Argentina', dial: '54', flag: '🇦🇷' },
  { name: 'Brasil', dial: '55', flag: '🇧🇷' },
  { name: 'Chile', dial: '56', flag: '🇨🇱' },
  { name: 'Colombia', dial: '57', flag: '🇨🇴' },
  { name: 'México', dial: '52', flag: '🇲🇽' },
  { name: 'Perú', dial: '51', flag: '🇵🇪' },
  { name: 'Uruguay', dial: '598', flag: '🇺🇾' },
  { name: 'Paraguay', dial: '595', flag: '🇵🇾' },
  { name: 'Venezuela', dial: '58', flag: '🇻🇪' },
  { name: 'Ecuador', dial: '593', flag: '🇪🇨' },
  { name: 'Bolivia', dial: '591', flag: '🇧🇴' },
  { name: 'España', dial: '34', flag: '🇪🇸' },
  { name: 'Estados Unidos', dial: '1', flag: '🇺🇸' },
];

interface PhoneInputProps {
  label: string;
  localNumber: string;
  onChangeLocalNumber: (num: string) => void;
  countryDial: string;
  onChangeCountryDial: (dial: string) => void;
  placeholder?: string;
  editable?: boolean;
}

/**
 * Input de teléfono con selector de código de país.
 * `localNumber` es el número local (sin código de país).
 * El componente padre compone el número completo: `countryDial + localNumber`.
 */
export default function PhoneInput({
  label,
  localNumber,
  onChangeLocalNumber,
  countryDial,
  onChangeCountryDial,
  placeholder = '280 456 7890',
  editable = true,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountry = COUNTRY_CODES.find((c) => c.dial === countryDial) ?? COUNTRY_CODES[0];

  const filteredCountries = searchQuery.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.dial.includes(searchQuery),
      )
    : COUNTRY_CODES;

  const handleSelect = (country: CountryCode) => {
    onChangeCountryDial(country.dial);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, focused && styles.fieldLabelFocused]}>{label}</Text>
      <View style={[styles.fieldInputWrap, focused && styles.fieldInputWrapFocused]}>
        {/* Country code selector */}
        <TouchableOpacity
          style={styles.codeSelector}
          onPress={() => editable && setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>+{selectedCountry.dial}</Text>
          <ChevronDown size={14} color={colors.onSurfaceVariant} strokeWidth={1.5} />
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Phone number input */}
        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={colors.outline + '66'}
          value={localNumber}
          onChangeText={(text) => onChangeLocalNumber(text.replace(/[^\d]/g, ''))}
          keyboardType="phone-pad"
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>

      {/* Country picker modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Código de país</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setSearchQuery(''); }}>
                <Text style={styles.modalClose}>Cerrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearch}>
              <Search size={16} color={colors.onSurfaceVariant} strokeWidth={1.5} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Buscar país..."
                placeholderTextColor={colors.outline + '66'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.dial}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryRow, item.dial === countryDial && styles.countryRowActive]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDial}>+{item.dial}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** Compone el número completo normalizado (solo dígitos, con código de país). */
export function buildFullPhone(countryDial: string, localNumber: string): string {
  const digits = localNumber.replace(/[^\d]/g, '');
  return `${countryDial}${digits}`;
}

/** Extrae dígitos locales de un número completo, dado un código de país. */
export function extractLocalNumber(fullPhone: string, countryDial: string): string {
  const digits = fullPhone.replace(/[^\d]/g, '');
  return digits.startsWith(countryDial) ? digits.slice(countryDial.length) : digits;
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  fieldLabelFocused: {
    color: colors.primary,
  },
  fieldInputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ghostBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInputWrapFocused: {
    borderBottomColor: colors.primaryContainer,
  },
  codeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.base,
    paddingRight: spacing.sm,
  },
  flag: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurface,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: spacing.sm,
  },
  fieldInput: {
    flex: 1,
    paddingVertical: spacing.base,
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surfaceContainerHigh,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '70%',
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  modalTitle: {
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.onSurface,
  },
  modalClose: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.primary,
  },
  modalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurface,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.base,
  },
  countryRowActive: {
    backgroundColor: colors.primaryHalo,
  },
  countryFlag: {
    fontSize: 22,
  },
  countryName: {
    flex: 1,
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurface,
  },
  countryDial: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurfaceVariant,
  },
});
