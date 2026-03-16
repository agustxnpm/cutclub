import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export interface ClienteResponse {
  id: string;
  nombre: string;
  telefono: string;
  codigoReferido: string;
  contadorFidelidad: number;
}

export async function postCliente(nombre: string, telefono: string): Promise<ClienteResponse> {
  const response = await api.post<ClienteResponse>('/api/v1/clientes', {
    nombre,
    telefono,
  });
  return response.data;
}
