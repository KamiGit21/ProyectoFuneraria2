import api from './axiosInstance';

export type Estado = 'PENDIENTE' | 'PROCESO' | 'FINALIZADO';

export interface Difunto {
  nombres: string;
  fecha_fallecido: string;     // ISO
}

export interface Orden {
  id: string;
  estado: Estado;
  total: number;
  difunto: Difunto;
  servicio: { nombre: string };
}

export const contratarServicio = (body: {
  servicioId: number;
  clienteId: number;
  difunto: Difunto;
}) => api.post<Orden>('/ordenes', body).then(r => r.data);

export const misOrdenes = () =>
  api.get<Orden[]>('/ordenes/mias').then(r => r.data);

export const seguimientoOrden = (id: string) =>
  api.get<Orden>(`/ordenes/${id}`).then(r => r.data);
