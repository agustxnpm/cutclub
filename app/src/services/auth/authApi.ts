/**
 * Endpoints de autenticación. Encapsula:
 *   - llamada HTTP al backend,
 *   - persistencia/limpieza de la sesión vía {@link authStore}.
 *
 * El resto de la app no debe llamar `/api/v1/auth/...` directamente; lo hace por aquí
 * para garantizar que `authStore` quede consistente con el estado real del servidor.
 */
import { api } from '../http/api';
import { type AuthSession, clearSession, setSession } from './authStore';

export interface LoginPayload {
  telefono: string;
  contrasena: string;
}

export interface RegistroPayload {
  nombre: string;
  telefono: string;
  contrasena: string;
  codigoReferido?: string;
}

interface AuthResponseDto {
  id: string;
  token: string;
  telefono: string;
  nombre: string | null;
  roles: string[];
}

function toSession(dto: AuthResponseDto): AuthSession {
  return {
    id: dto.id,
    token: dto.token,
    telefono: dto.telefono,
    nombre: dto.nombre,
    roles: dto.roles,
  };
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await api.post<AuthResponseDto>('/api/v1/auth/login', payload);
  const session = toSession(data);
  await setSession(session);
  return session;
}

export async function registrar(payload: RegistroPayload): Promise<AuthSession> {
  const body = {
    ...payload,
    codigoReferido: payload.codigoReferido?.trim() || undefined,
  };
  const { data } = await api.post<AuthResponseDto>('/api/v1/auth/registro', body);
  const session = toSession(data);
  await setSession(session);
  return session;
}

export async function logout(): Promise<void> {
  await clearSession();
}
