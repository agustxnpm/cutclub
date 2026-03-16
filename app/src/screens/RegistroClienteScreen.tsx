import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { postCliente } from '../services/clientesApi';
import { colors, spacing, radius, fonts, shadows } from '../styles/theme';

function Toast({ message, type, onHide }: { message: string; type: 'success' | 'error'; onHide: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onHide);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.toast, type === 'success' ? styles.toastSuccess : styles.toastError, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

function FocusableInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad';
  editable: boolean;
  autoCapitalize?: 'none' | 'words';
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'none'}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

export default function RegistroClienteScreen() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleGuardar = async () => {
    setToast(null);

    if (!nombre.trim()) {
      setToast({ message: 'El nombre es obligatorio', type: 'error' });
      return;
    }
    if (!telefono.trim()) {
      setToast({ message: 'El teléfono es obligatorio', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const cliente = await postCliente(nombre.trim(), telefono.trim());
      setNombre('');
      setTelefono('');
      setToast({ message: `Cliente registrado correctamente`, type: 'success' });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409 || status === 400) {
        setToast({ message: 'Ese teléfono ya está registrado', type: 'error' });
      } else {
        setToast({ message: 'Error al registrar cliente', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/poste-de-barbero.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>Nuevo cliente</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, shadows.sm]}>
            <FocusableInput
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Juan Pérez"
              autoCapitalize="words"
              editable={!isLoading}
            />

            <FocusableInput
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Ej: 2804567890"
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleGuardar}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl + spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  headerIcon: {
    width: 64,
    height: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fonts.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fonts.small,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelFocused: {
    color: colors.primary,
  },
  input: {
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    fontSize: fonts.body,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  button: {
    height: 52,
    backgroundColor: '#1A2A3D',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fonts.body,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  toast: {
    position: 'absolute',
    top: spacing.xxxl + spacing.base,
    left: spacing.lg,
    right: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    zIndex: 100,
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  toastSuccess: {
    backgroundColor: '#1A2A3D',
  },
  toastError: {
    backgroundColor: '#2D1A1A',
  },
  toastText: {
    color: colors.textPrimary,
    fontSize: fonts.small,
    fontWeight: '600',
  },
});
