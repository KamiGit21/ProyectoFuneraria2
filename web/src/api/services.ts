import api from './axiosInstance';

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  activo: boolean;
  categoriaId?: string;
}

// ── Categorías ─────────────────────────────────────────────────────────────
export const getCategorias = () =>
  api.get<Categoria[]>('/categorias').then(r => r.data);

export const createCategoria = (d: Omit<Categoria, 'id'>) =>
  api.post<Categoria>('/categorias', d).then(r => r.data);

export const updateCategoria = (id: string, d: Partial<Categoria>) =>
  api.patch<Categoria>(`/categorias/${id}`, d).then(r => r.data);

export const deleteCategoria = (id: string) =>
  api.delete(`/categorias/${id}`);

// ── Servicios ───────────────────────────────────────────────────────────────
// Ahora enviamos `categoriaId` como parámetro de consulta.
export const getServicios = (categoriaId?: string) =>
  api
    .get<Servicio[]>('/servicios', {
      params: categoriaId ? { categoriaId } : {},
    })
    .then(r => r.data);

export const createServicio = (d: Omit<Servicio, 'id' | 'activo'>) =>
  api.post<Servicio>('/servicios', d).then(r => r.data);

export const updateServicio = (id: string, d: Partial<Servicio>) =>
  api.patch<Servicio>(`/servicios/${id}`, d).then(r => r.data);

export const deleteServicio = (id: string) =>
  api.delete(`/servicios/${id}`);
