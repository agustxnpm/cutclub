/**
 * Estado de autenticación: token JWT + identidad básica.
 *
 * - Token en memoria (acceso síncrono O(1) desde el interceptor de Axios).
 * - Persistencia espejo en storage para sobrevivir reloads.
 * - Hidratación explícita al boot vía {@link bootAuth}: la app debe `await` esta promesa
 *   antes de renderizar pantallas autenticadas para evitar race conditions
 *   (que un request salga sin token aunque el usuario sí esté logueado).
 * - Patrón observer (`subscribe`) para que la UI reaccione a login/logout sin acoplar
 *   este módulo a React.
 */
import { tokenStorage } from '../storage/tokenStorage';

const STORAGE_KEY = 'cutclub.auth.session';

export interface AuthSession {
  id: string;
  token: string;
  telefono: string;
  nombre: string | null;
  roles: string[];
}

type Listener = (session: AuthSession | null) => void;

let session: AuthSession | null = null;
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((l) => l(session));
}

/**
 * Carga la sesión persistida. Idempotente y safe de llamar múltiples veces:
 * la promesa se cachea, así varios callers comparten la misma hidratación.
 */
export function bootAuth(): Promise<void> {
  if (hydrated) return Promise.resolve();
  if (hydrationPromise) return hydrationPromise;

  hydrationPromise = (async () => {
    try {
      const raw = await tokenStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthSession;
        if (parsed?.token && parsed?.id) {
          session = parsed;
        }
      }
    } catch {
      session = null;
    } finally {
      hydrated = true;
      emit();
    }
  })();

  return hydrationPromise;
}

export function getSession(): AuthSession | null {
  return session;
}

export function getToken(): string | null {
  return session?.token ?? null;
}

export function isAuthenticated(): boolean {
  return session !== null;
}

export async function setSession(next: AuthSession): Promise<void> {
  session = next;
  await tokenStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

export async function clearSession(): Promise<void> {
  session = null;
  await tokenStorage.removeItem(STORAGE_KEY);
  emit();
}

/**
 * Suscribe un listener a cambios de sesión. Retorna una función de unsuscripción.
 * Útil para hooks tipo `useAuthSession` o para reaccionar al 401 desde la UI.
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
