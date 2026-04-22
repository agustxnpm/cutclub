import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getBaseUrl(): string {
  if (Platform.OS === 'web') return 'http://localhost:8080';

  // En Expo Go, debuggerHost contiene la IP del dev server (ej. "192.168.0.112:8081")
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.experienceUrl ?? '';
  const ip = debuggerHost.split(':')[0];
  return ip ? `http://${ip}:8080` : 'http://localhost:8080';
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

export interface ClienteResponse {
  id: string;
  nombre: string;
  telefono: string;
  codigoReferido: string;
  contadorFidelidad: number;
}

export interface CorteResponse {
  id: string;
  fecha: string;
  tipo: string | null;
  notas: string | null;
}

export interface BeneficioResponse {
  id: string;
  tipo: string;
  fechaCreacion: string;
}

export interface PerfilClienteResponse {
  id: string;
  nombre: string;
  telefono: string;
  codigoReferido: string;
  contadorFidelidad: number;
  ultimoCorte: CorteResponse | null;
  beneficiosDisponibles: BeneficioResponse[];
}

export async function listarClientes(): Promise<ClienteResponse[]> {
  const response = await api.get<ClienteResponse[]>('/api/v1/clientes');
  return response.data;
}

export async function postCliente(nombre: string, telefono: string): Promise<ClienteResponse> {
  const response = await api.post<ClienteResponse>('/api/v1/clientes', {
    nombre,
    telefono,
  });
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

/**
 * Login de cliente por teléfono.
 * Busca un cliente existente por su teléfono y devuelve su perfil.
 * Si el teléfono fue registrado previamente por el barbero, vincula automáticamente.
 */
export interface AuthResponse {
  clienteId: string;
  nombre: string;
  telefono: string;
}

export async function loginCliente(telefono: string, contrasena: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/v1/clientes/auth/login', {
    telefono,
    contrasena,
  });
  return response.data;
}

/**
 * Registro autónomo de un cliente.
 * Si el teléfono ya existe (registrado por el barbero), el backend vincula
 * la cuenta y retorna el cliente existente con su historial.
 */
export async function registroCliente(nombre: string, telefono: string, contrasena: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/v1/clientes/auth/registro', {
    nombre,
    telefono,
    contrasena,
  });
  return response.data;
}
