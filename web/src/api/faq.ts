// services/faqService.ts

import api from './axiosInstance';

export type Faq = {
  id: number;
  pregunta: string;
  respuesta: string;
};

export const fetchFaqs = async (): Promise<Faq[]> => {
  const response = await api.get<Faq[]>('/faq');
  return response.data;
};
