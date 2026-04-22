import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export type AuthMode = 'login' | 'registro';

export type Screen =
  | { name: 'buscar' }
  | { name: 'registro' }
  | { name: 'perfil'; clienteId: string }
  | { name: 'preAuth' }
  | { name: 'authCliente'; mode: AuthMode };

const ROUTES: Record<string, (params?: Record<string, string>) => Screen> = {
  '/': () => ({ name: 'buscar' }),
  '/clientes': () => ({ name: 'buscar' }),
  '/clientes/registro': () => ({ name: 'registro' }),
  '/clientes/:id': (p) => ({ name: 'perfil', clienteId: p!.id }),
  '/cuenta': () => ({ name: 'preAuth' }),
  '/login': () => ({ name: 'authCliente', mode: 'login' as AuthMode }),
  '/crear-cuenta': () => ({ name: 'authCliente', mode: 'registro' as AuthMode }),
};

function screenToPath(screen: Screen): string {
  switch (screen.name) {
    case 'buscar': return '/clientes';
    case 'registro': return '/clientes/registro';
    case 'perfil': return `/clientes/${screen.clienteId}`;
    case 'preAuth': return '/cuenta';
    case 'authCliente': return screen.mode === 'registro' ? '/crear-cuenta' : '/login';
  }
}

function pathToScreen(path: string): Screen {
  const clean = path === '/' ? '/' : path.replace(/\/$/, '');

  // Static routes
  if (clean === '/' || clean === '/clientes') return { name: 'buscar' };
  if (clean === '/clientes/registro') return { name: 'registro' };
  if (clean === '/cuenta') return { name: 'preAuth' };
  if (clean === '/login') return { name: 'authCliente', mode: 'login' };
  if (clean === '/crear-cuenta') return { name: 'authCliente', mode: 'registro' };

  // Dynamic: /clientes/:id
  const match = clean.match(/^\/clientes\/([^/]+)$/);
  if (match) return { name: 'perfil', clienteId: match[1] };

  // Fallback
  return { name: 'buscar' };
}

/**
 * Hook que sincroniza el estado de navegación con la URL del navegador.
 * En mobile/native, funciona como un useState normal.
 */
export function useRouter() {
  const isWeb = Platform.OS === 'web';

  const [screen, setScreenState] = useState<Screen>(() => {
    if (isWeb && typeof window !== 'undefined') {
      return pathToScreen(window.location.pathname);
    }
    return { name: 'buscar' };
  });

  // Navegar: actualiza estado + URL
  const navigate = useCallback((next: Screen) => {
    setScreenState(next);
    if (isWeb && typeof window !== 'undefined') {
      const path = screenToPath(next);
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
  }, [isWeb]);

  // Escuchar back/forward del navegador
  useEffect(() => {
    if (!isWeb || typeof window === 'undefined') return;

    const handlePopState = () => {
      setScreenState(pathToScreen(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isWeb]);

  return { screen, navigate };
}
