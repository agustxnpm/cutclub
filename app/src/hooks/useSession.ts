import { useEffect, useState } from 'react';
import { getSession, subscribe, type AuthSession } from '../services/auth/authStore';

/**
 * Hook reactivo que expone la sesión actual.
 * Se actualiza automáticamente ante login / logout / expiración de token.
 */
export function useSession(): AuthSession | null {
  const [session, setSession] = useState<AuthSession | null>(getSession);
  useEffect(() => subscribe(setSession), []);
  return session;
}

/** Devuelve true si el usuario autenticado tiene el rol BARBERO. */
export function useIsBarbero(): boolean {
  const session = useSession();
  return session?.roles.includes('BARBERO') ?? false;
}
