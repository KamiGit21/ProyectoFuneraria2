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
    const response = await axios.get('/v1/dashboard/metrics');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas del dashboard:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas del dashboard');
  }
}

/** Obtiene métricas de velatorios (GET /v1/dashboard/velatorios) */
export async function getVelatoriosMetrics(): Promise<VelatoriosMetrics> {
  try {
    const response = await axios.get('/v1/dashboard/velatorios');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas de velatorios:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas de velatorios');
  }
}

/** Obtiene métricas de servicios (GET /v1/dashboard/servicios) */
export async function getServiciosMetrics(): Promise<ServiciosMetrics> {
  try {
    const response = await axios.get('/v1/dashboard/servicios');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas de servicios:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas de servicios');
  }
}

/** Obtiene métricas de inventario (GET /v1/dashboard/inventario) */
export async function getInventarioMetrics(): Promise<InventarioMetrics> {
  try {
    const response = await axios.get('/v1/dashboard/inventario');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas de inventario:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas de inventario');
  }
}

/** Obtiene métricas de usuarios (GET /v1/dashboard/usuario) */
export async function getUsuarioMetrics(): Promise<UsuarioMetrics> {
  try {
    const response = await axios.get('/v1/dashboard/usuario');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas de usuarios:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas de usuarios');
  }
}

/** Obtiene métricas de reportes (GET /v1/dashboard/reportes) */
export async function getReportesMetrics(): Promise<ReportesMetrics> {
  try {
    const response = await axios.get('/v1/dashboard/reportes');
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener métricas de reportes:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener métricas de reportes');
  }
}