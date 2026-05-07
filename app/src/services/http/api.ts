/**
 * Instancia única de Axios para toda la app.
 *
 * Responsabilidades:
 * - baseURL multi-plataforma (localhost en web, IP del dev server en Expo Go).
 * - Interceptor de request: agrega `Authorization: Bearer <token>` si hay sesión.
 * - Interceptor de response: ante 401 limpia la sesión y notifica a la UI vía `authStore`.
 *
 * Decisiones:
 * - El interceptor se monta UNA sola vez (módulo singleton importado por el resto).
 * - El header se construye usando `AxiosHeaders` para evitar el caso `headers undefined`.
 * - No implementamos refresh token: el backend aún no lo soporta. Cuando exista,
 *   el lugar para hookearlo es el bloque marcado `// HOOK: refresh token`.
 */
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { clearSession, getToken } from '../auth/authStore';

function getBaseUrl(): string {
  if (Platform.OS === 'web') return 'http://localhost:8080';

  // En Expo Go, debuggerHost contiene la IP del dev server (ej. "192.168.0.112:8081")
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.experienceUrl ?? '';
  const ip = debuggerHost.split(':')[0];
  return ip ? `http://${ip}:8080` : 'http://localhost:8080';
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    // AxiosHeaders garantiza la estructura correcta y evita "headers is undefined".
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

/**
 * Callback opcional para que la UI reaccione a una expiración (ej. navegar a login).
 * Se setea desde la capa de presentación con {@link setOnUnauthorized}.
 */
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? '';

    // No tratamos como expiración los 401 del propio login (son credenciales inválidas).
    const isAuthEndpoint = url.includes('/api/v1/auth/');

    if (status === 401 && !isAuthEndpoint) {
      // TODO HOOK: refresh token. Si el backend expone /auth/refresh:
      //   1. Intentar refrescar usando un refreshToken persistido.
      //   2. Si éxito: reintentar `error.config` con el nuevo token.
      //   3. Si falla: caer al logout de abajo.
      await clearSession();
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
