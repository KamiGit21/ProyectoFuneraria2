// controllers/faq.controller.ts

import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const getAllFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.faq.findMany();

    const result = faqs.map(faq => ({
      id: faq.id,
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener las FAQs:', error);
    res.status(500).json({ message: 'Error al obtener las preguntas frecuentes' });
  }
};