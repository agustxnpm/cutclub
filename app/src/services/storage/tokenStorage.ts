/**
 * Storage cross-platform asíncrono para credenciales.
 *
 * - Web: `localStorage` (síncrono, lo envolvemos en Promise por uniformidad).
 * - Nativo (iOS/Android): `AsyncStorage`.
 *
 * Decisiones:
 * - API uniforme `Promise<...>` para que el resto del código no haga branching por plataforma.
 * - Carga perezosa de `AsyncStorage` con `require` para no romper el bundle web si el
 *   módulo nativo no estuviera disponible.
 *
 * Seguridad (lectura obligatoria antes de pasar a producción real):
 * - En web, `localStorage` es vulnerable a XSS. Para alta sensibilidad mover a cookies
 *   httpOnly+Secure+SameSite=strict gestionadas por el backend.
 * - En móvil, `AsyncStorage` NO está cifrado. Si el token vale > sesión corta, usar
 *   `expo-secure-store` (iOS Keychain / Android Keystore).
 */
import { Platform } from 'react-native';

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

class WebStorage implements KeyValueStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      return globalThis.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }
  async setItem(key: string, value: string): Promise<void> {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      /* quota / modo privado: degradamos silenciosamente */
    }
  }
  async removeItem(key: string): Promise<void> {
    try {
      globalThis.localStorage?.removeItem(key);
    } catch {
      /* noop */
    }
  }
}

class NativeStorage implements KeyValueStorage {
  // Carga perezosa: sólo se evalúa en plataformas nativas.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  private impl = require('@react-native-async-storage/async-storage').default as KeyValueStorage;

  getItem(key: string): Promise<string | null> {
    return this.impl.getItem(key);
  }
  setItem(key: string, value: string): Promise<void> {
    return this.impl.setItem(key, value);
  }
  removeItem(key: string): Promise<void> {
    return this.impl.removeItem(key);
  }
}

export const tokenStorage: KeyValueStorage =
  Platform.OS === 'web' ? new WebStorage() : new NativeStorage();
