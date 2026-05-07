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
} from 'react-native';
import { User, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { login, registrar } from '../services/auth/authApi';
import { type AuthSession } from '../services/auth/authStore';
import { colors, spacing, radius, fonts, shadows } from '../styles/theme';
import PhoneInput, { buildFullPhone } from '../components/PhoneInput';

type AuthMode = 'login' | 'registro';

/* ─── Toast ─── */
function Toast({ message, type, onHide }: { message: string; type: 'success' | 'error' | 'info'; onHide: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onHide);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const bg =
    type === 'success' ? styles.toastSuccess :
    type === 'info' ? styles.toastInfo :
    styles.toastError;

  const textColor =
    type === 'success' ? styles.toastTextSuccess :
    type === 'info' ? styles.toastTextInfo :
    styles.toastTextError;

  return (
    <Animated.View style={[styles.toast, bg, { opacity, transform: [{ translateY }] }]}>
      <Text style={[styles.toastText, textColor]}>{message}</Text>
    </Animated.View>
  );
}

/* ─── Editorial Input ─── */
function EditorialInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable,
  autoCapitalize,
  secureTextEntry,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  editable: boolean;
  autoCapitalize?: 'none' | 'words';
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry ?? false);

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, focused && styles.fieldLabelFocused]}>{label}</Text>
      <View style={[styles.fieldInputWrap, focused && styles.fieldInputWrapFocused]}>
        <TextInput
          style={styles.fieldInput}
          placeholder={placeholder}
          placeholderTextColor={colors.outline + '66'}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hidePassword}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} activeOpacity={0.7} style={styles.eyeBtn}>
            {hidePassword
              ? <EyeOff size={18} color={colors.outline + '80'} strokeWidth={1.5} />
              : <Eye size={18} color={colors.primary} strokeWidth={1.5} />}
          </TouchableOpacity>
        )}
        {icon && <View style={styles.fieldIconWrap}>{icon}</View>}
      </View>
    </View>
  );
}

interface AuthClienteScreenProps {
  initialMode?: AuthMode;
  onAuthSuccess: (session: AuthSession) => void;
  onSwitchMode?: (mode: AuthMode) => void;
}

export default function AuthClienteScreen({ initialMode = 'login', onAuthSuccess, onSwitchMode }: AuthClienteScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [phoneDial, setPhoneDial] = useState('54');
  const [contrasena, setContrasena] = useState('');
  const [codigoReferido, setCodigoReferido] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const resetForm = () => {
    setNombre('');
    setTelefono('');
    setPhoneDial('54');
    setContrasena('');
    setCodigoReferido('');
    setToast(null);
  };

  const switchMode = (newMode: AuthMode) => {
    if (newMode === mode) return;
    const direction = newMode === 'registro' ? 1 : -1;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * 20, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      resetForm();
      setMode(newMode);
      onSwitchMode?.(newMode);
      slideAnim.setValue(-direction * 20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleLogin = async () => {
    setToast(null);
    if (!telefono.trim()) {
      setToast({ message: 'Ingresa tu número de teléfono', type: 'error' });
      return;
    }
    if (!contrasena) {
      setToast({ message: 'Ingresa tu contraseña', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const session = await login({ telefono: buildFullPhone(phoneDial, telefono.trim()), contrasena });
      setToast({ message: `Bienvenido${session.nombre ? ', ' + session.nombre : ''}`, type: 'success' });
      setTimeout(() => onAuthSuccess(session), 600);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setToast({ message: 'No encontramos una cuenta con ese teléfono. ¿Querés crear una?', type: 'info' });
      } else if (status === 401) {
        setToast({ message: 'Contraseña incorrecta', type: 'error' });
      } else {
        setToast({ message: 'Error al iniciar sesión', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistro = async () => {
    setToast(null);
    if (!nombre.trim()) {
      setToast({ message: 'El nombre es obligatorio', type: 'error' });
      return;
    }
    if (!telefono.trim()) {
      setToast({ message: 'El teléfono es obligatorio', type: 'error' });
      return;
    }
    if (!contrasena || contrasena.length < 4) {
      setToast({ message: 'La contraseña debe tener al menos 4 caracteres', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const session = await registrar({ nombre: nombre.trim(), telefono: buildFullPhone(phoneDial, telefono), contrasena, codigoReferido: codigoReferido.trim() || undefined });
      setToast({ message: '¡Cuenta creada! Bienvenido al club', type: 'success' });
      setTimeout(() => onAuthSuccess(session), 600);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setToast({
          message: 'Este teléfono ya tiene cuenta. Iniciando sesión...',
          type: 'info',
        });
        // Intentar login automático
        try {
          const session = await login({ telefono: buildFullPhone(phoneDial, telefono.trim()), contrasena });
          setTimeout(() => onAuthSuccess(session), 1500);
        } catch {
          // Si falla el login automático, que el usuario intente manualmente
        }
      } else if (status === 400 && err?.response?.data?.error?.toLowerCase().includes('referido')) {
        setToast({ message: 'El código de referido ingresado no es válido', type: 'error' });
      } else {
        setToast({ message: 'Error al crear la cuenta', type: 'error' });
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
          {/* ════════════════════════════════════════
              COMPACT HEADER
             ════════════════════════════════════════ */}
          <Animated.View style={[styles.editorialHeader, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.eyebrow}>
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Nuevo miembro'}
            </Text>
            <Text style={styles.headlineWhite}>
              {mode === 'login' ? 'Ingresá con tu' : 'Completá tus'}
            </Text>
            <Text style={styles.headlinePrimary}>
              {mode === 'login' ? 'Teléfono' : 'Datos'}
            </Text>
          </Animated.View>

          {/* ════════════════════════════════════════
              FORM — editorial fields
             ════════════════════════════════════════ */}
          <View style={styles.formContainer}>
            <View style={styles.formHalo} />

            <Animated.View style={[styles.formFields, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
              {mode === 'registro' && (
                <EditorialInput
                  label="Nombre completo"
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder=""
                  autoCapitalize="words"
                  editable={!isLoading}
                  icon={<User size={18} color={colors.outline + '4D'} strokeWidth={1.5} />}
                />
              )}

              <PhoneInput
                label="Número de teléfono"
                localNumber={telefono}
                onChangeLocalNumber={setTelefono}
                countryDial={phoneDial}
                onChangeCountryDial={setPhoneDial}
                editable={!isLoading}
              />

              {mode === 'registro' && (
                <EditorialInput
                  label="Código de referido (opcional)"
                  value={codigoReferido}
                  onChangeText={setCodigoReferido}
                  placeholder="Ej. ABC123"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              )}

              <EditorialInput
                label="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Tu contraseña"
                editable={!isLoading}
                secureTextEntry
              />

              {/* Primary CTA */}
              <View style={styles.ctaSection}>
                <TouchableOpacity
                  style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
                  onPress={mode === 'login' ? handleLogin : handleRegistro}
                  disabled={isLoading}
                  activeOpacity={0.84}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.onPrimaryContainer} />
                  ) : (
                    <View style={styles.ctaInner}>
                      <Text style={styles.ctaText}>
                        {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
                      </Text>
                      <ArrowRight size={20} color={colors.onPrimaryContainer} strokeWidth={1.5} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Switch mode link */}
              <TouchableOpacity
                style={styles.switchLink}
                onPress={() => switchMode(mode === 'login' ? 'registro' : 'login')}
                activeOpacity={0.7}
              >
                <Text style={styles.switchText}>
                  {mode === 'login'
                    ? '¿No tenés cuenta? '
                    : '¿Ya tenés cuenta? '}
                </Text>
                <Text style={styles.switchAccent}>
                  {mode === 'login' ? 'Crear una' : 'Iniciar sesión'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Background editorial decor */}
      <View style={styles.bgDecor} pointerEvents="none">
        <Text style={styles.bgDecorText}>CUT</Text>
      </View>
    </View>
  );
}

/* ═══════════════════════════════════════════════════
   Styles — Dark Barber Editorial / Auth Screen
   Follows DESIGN.md system & existing screen patterns
   ═══════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['6'],
    paddingBottom: spacing['6'] * 2,
    gap: spacing.xxl,
  },

  /* ── Editorial Header ── */
  editorialHeader: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    fontSize: fonts.labelSm,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 3.2,
    marginBottom: spacing.base,
  },
  headlineWhite: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplay,
    color: colors.onSurface,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
  },
  headlinePrimary: {
    fontSize: fonts.displayMd,
    fontFamily: fonts.familyDisplayItalic,
    color: colors.primary,
    letterSpacing: -1.5,
    lineHeight: fonts.displayMd * 0.95,
    marginBottom: spacing.base,
  },

  /* ── Form Container ── */
  formContainer: {
    position: 'relative',
  },
  formHalo: {
    position: 'absolute',
    top: -16,
    left: -16,
    right: -16,
    bottom: -16,
    backgroundColor: colors.primaryGlow,
    borderRadius: 32,
    opacity: 0.5,
  },
  formFields: {
    position: 'relative',
    gap: spacing.xxl,
  },

  /* ── Editorial Field ── */
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
  fieldInput: {
    flex: 1,
    paddingVertical: spacing.base,
    paddingHorizontal: 0,
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodySemiBold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  },
  fieldIconWrap: {
    paddingLeft: spacing.sm,
  },
  eyeBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  /* ── CTA ── */
  ctaSection: {
    paddingTop: spacing.xxl,
    gap: spacing.lg,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaText: {
    fontSize: fonts.titleMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.onPrimaryContainer,
  },
  ctaArrow: {
    fontSize: fonts.titleLg,
    color: colors.onPrimaryContainer,
    fontWeight: '300',
  },
  ctaFooter: {
    fontSize: fonts.labelSm,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    textAlign: 'center',
  },

  /* ── Switch Mode Link ── */
  switchLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  switchText: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBody,
    color: colors.onSurfaceVariant,
  },
  switchAccent: {
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodyBold,
    color: colors.primary,
  },

  /* ── Background Decor ── */
  bgDecor: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: spacing.xxl,
    opacity: 0.06,
  },
  bgDecorText: {
    fontSize: 120,
    fontFamily: fonts.familyDisplayBlackItalic,
    color: colors.onSurfaceVariant,
    letterSpacing: -6,
    lineHeight: 120,
  },

  /* ── Toast ── */
  toast: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.xl,
    right: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    zIndex: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ghostBorder,
    backgroundColor: colors.surfaceContainerHigh,
  },
  toastSuccess: {
    backgroundColor: '#153222',
    borderColor: 'rgba(76, 175, 80, 0.55)',
  },
  toastError: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  toastInfo: {
    backgroundColor: '#0F1A2E',
    borderColor: 'rgba(178, 197, 255, 0.35)',
  },
  toastText: {
    color: colors.onSurface,
    fontSize: fonts.bodyMd,
    fontFamily: fonts.familyBodySemiBold,
    textAlign: 'center',
  },
  toastTextSuccess: {
    color: '#EAF8EC',
  },
  toastTextError: {
    color: colors.onSurface,
  },
  toastTextInfo: {
    color: colors.primaryFixedDim,
  },
});
