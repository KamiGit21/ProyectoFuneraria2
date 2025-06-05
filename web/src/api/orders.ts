import api from './axiosInstance';

export type Estado = 'PENDIENTE' | 'PROCESO' | 'FINALIZADO';

export interface Difunto {
  nombres: string;
  fecha_fallecido: string; // ISO
}

export interface Orden {
  id: string;
  estado: Estado;
  total: number;
  difunto: Difunto;
  servicio: { nombre: string };
}

export interface ClientServiceDetail {
  clientName: string;
  serviceName: string;
  orderDate: string;
  quantity: number;
  subtotal: number;
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

export const getOrderReports = async (): Promise<ClientServiceDetail[]> => {
  try {
    const orders = await misOrdenes();
    return orders.map((order) => ({
      clientName: order.difunto.nombres,
      serviceName: order.servicio.nombre,
      orderDate: new Date(order.difunto.fecha_fallecido).toLocaleDateString(), // Format ISO date
      quantity: 1, // Default quantity since not provided in Orden
      subtotal: order.total,
    }));
  } catch (error) {
    throw new Error('Failed to fetch order reports');
  }
};