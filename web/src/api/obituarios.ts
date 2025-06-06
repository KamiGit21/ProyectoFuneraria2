import api from './axiosInstance';

export type Obituario = {
  id: number;
  orden_id: number;
  titulo: string;
  mensaje: string;
  url_slug: string;
  imagen_url: string;
  publicado: boolean;
  creado_en: string;
  actualizado_en: string;
};

export const fetchObituarios = async (): Promise<Obituario[]> => {
  const response = await api.get<Obituario[]>('http://localhost:3001/api/obituarios');
  return response.data;
};