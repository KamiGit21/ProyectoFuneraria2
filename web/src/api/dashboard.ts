import axios from './axiosInstance';

export interface Metric {
  month: string;
  value: number;
}

export interface DashboardMetrics {
  services: Metric[];
  revenue: Metric[];
  obituaries: Metric[];
  activeServices: number;
  occupiedFunerals: string;
  monthlyRevenue: string; // String to match provided interface
}

export interface VelatoriosMetrics {
  byMonth: Array<{ month: string; count: number }>;
  byDay: Array<{ day: string; count: number }>;
}

export interface ServiciosMetrics {
  byMonth: Array<{ month: string; service: string; count: number }>;
  byWeek: Array<{ week: string; service: string; count: number }>;
}

export interface InventarioMetrics {
  byMonth: Array<{ month: string; count: number }>;
  byWeek: Array<{ week: string; count: number }>;
}

export interface UsuarioMetrics {
  byService: Array<{ service: string; count: number }>;
}

export interface ReportesMetrics {
  services: Array<{ name: string; count: number; revenue: number }>;
}

/** Obtiene métricas del dashboard (GET /v1/dashboard/metrics) */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const response = await axios.get<{ data: DashboardMetrics }>('/v1/dashboard/metrics');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error al obtener métricas del dashboard';
    console.error('Error al obtener métricas del dashboard:', errorMessage);
    throw new Error(errorMessage);
  }
}

/** Obtiene métricas de velatorios (GET /v1/dashboard/velatorios) */
export async function getVelatoriosMetrics(): Promise<VelatoriosMetrics> {
  try {
    const response = await axios.get<{ data: VelatoriosMetrics }>('/v1/dashboard/velatorios');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error al obtener métricas de velatorios';
    console.error('Error al obtener métricas de velatorios:', errorMessage);
    throw new Error(errorMessage);
  }
}

/** Obtiene métricas de servicios (GET /v1/dashboard/servicios) */
export async function getServiciosMetrics(): Promise<ServiciosMetrics> {
  try {
    const response = await axios.get<{ data: ServiciosMetrics }>('/v1/dashboard/servicios');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error al obtener métricas de servicios';
    console.error('Error al obtener métricas de servicios:', errorMessage);
    throw new Error(errorMessage);
  }
}

/** Obtiene métricas de inventario (GET /v1/dashboard/inventario) */
export async function getInventarioMetrics(): Promise<InventarioMetrics> {
  try {
    const response = await axios.get<{ data: InventarioMetrics }>('/v1/dashboard/inventario');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error al obtener métricas de inventario';
    console.error('Error al obtener métricas de inventario:', errorMessage);
    throw new Error(errorMessage);
  }
}

/** Obtiene métricas de usuarios (GET /v1/dashboard/usuario) */
export async function getUsuarioMetrics(): Promise<UsuarioMetrics> {
  try {
    const response = await axios.get<{ data: UsuarioMetrics }>('/v1/dashboard/usuario');
    return response.data.data;
  } catch (error: any) {
    const errorMessage: string = error.response?.data?.error || 'Error al obtener métricas de usuario';
    console.error('Error al obtener métricas de usuario:', errorMessage);
    throw new Error(errorMessage);
  }
}

/** Obtiene métricas de reportes (GET /v1/dashboard/reportes) */
export async function getReportesMetrics(): Promise<ReportesMetrics> {
  try {
    const response = await axios.get<{ data: ReportesMetrics }>('/v1/dashboard/reportes');
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error al obtener métricas de reportes';
    console.error('Error al obtener métricas de reportes:', errorMessage);
    throw new Error(errorMessage);
  }
}
