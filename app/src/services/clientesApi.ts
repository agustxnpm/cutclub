/**
 * Endpoints de negocio (clientes, cortes, beneficios, referidos).
 *
 * La autenticación está separada en `./auth/authApi.ts` y `./auth/authStore.ts`.
 * Los wrappers `loginCliente` / `registroCliente` se conservan como adaptadores
 * para mantener la firma que ya consumen las pantallas existentes.
 */
import { api } from './http/api';
import { login, registrar } from './auth/authApi';
import type { AuthSession } from './auth/authStore';

export interface ClienteResponse {
  id: string;
  nombre: string;
  telefono: string;
  codigoReferido: string;
  contadorFidelidad: number;
}

export interface CorteResponse {
  id: string;
  tipoCorte: string;
  precio: number;
  fecha: string;
  esGratis: boolean;
}

export interface RegistrarCorteRequest {
  clienteId: string;
  tipoCorte: string;
  precio: number;
}

export interface BeneficioResponse {
  id: string;
  tipo: string;
  fechaCreacion: string;
  descripcionOrigen: string;
}

export interface PerfilClienteResponse {
  id: string;
  nombre: string;
  telefono: string;
  codigoReferido: string;
  contadorFidelidad: number;
  ultimoCorte: CorteResponse | null;
  historialCortes: CorteResponse[];
  beneficiosDisponibles: BeneficioResponse[];
  esReferidoPendiente: boolean;
  nombreReferente: string | null;
  fechaRegistro: string | null;
}

export async function listarClientes(): Promise<ClienteResponse[]> {
  const response = await api.get<ClienteResponse[]>('/api/v1/clientes');
  return response.data;
}

export async function postCliente(nombre: string, telefono: string): Promise<ClienteResponse> {
  const response = await api.post<ClienteResponse>('/api/v1/clientes', { nombre, telefono });
  return response.data;
}

export async function buscarClientes(query: string): Promise<ClienteResponse[]> {
  const response = await api.get<ClienteResponse[]>('/api/v1/clientes/buscar', {
    params: { query },
  });
  return response.data;
}

export async function obtenerPerfilCliente(clienteId: string): Promise<PerfilClienteResponse> {
  const response = await api.get<PerfilClienteResponse>(`/api/v1/clientes/${clienteId}/perfil`);
  return response.data;
}

export async function registrarCorte(req: RegistrarCorteRequest): Promise<{ id: string }> {
  const response = await api.post<{ id: string }>('/api/v1/cortes', req);
  return response.data;
}

export interface CanjearCorteGratisRequest {
  clienteId: string;
  beneficioId: string;
  tipoCorte: string;
}

export async function canjearCorteGratis(
  req: CanjearCorteGratisRequest,
): Promise<{ id: string; esGratis: string }> {
  const response = await api.post<{ id: string; esGratis: string }>('/api/v1/cortes/canje', req);
  return response.data;
}

export async function validarReferido(referidoId: string, esNuevoReal: boolean): Promise<void> {
  await api.patch(`/api/v1/referidos/${referidoId}/validar`, { esNuevoReal });
}

// --- Adaptadores de auth para preservar la API que usan las screens actuales ---

export type AuthResponse = AuthSession;

export function loginCliente(telefono: string, contrasena: string): Promise<AuthResponse> {
  return login({ telefono, contrasena });
}

export function registroCliente(
  nombre: string,
  telefono: string,
  contrasena: string,
  codigoReferido?: string,
): Promise<AuthResponse> {
  return registrar({ nombre, telefono, contrasena, codigoReferido });
}
