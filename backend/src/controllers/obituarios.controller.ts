import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

// Obtener lista de obituarios
export const getObituarios = async (req: Request, res: Response) => {
  const limit = parseInt((req.query.limit as string) || '10', 10);
  try {
    const obituarios = await prisma.obituario.findMany({
      where: { publicado: true },
      orderBy: { creado_en: 'desc' },
      take: limit,
    });
    res.json(obituarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener obituarios' });
  }
};

// Crear un obituario
export const createObituario = async (req: Request, res: Response) => {
  try {
    const obituario = await prisma.obituario.create({
      data: req.body,
    });
    res.status(201).json(obituario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear obituario' });
  }
};

// Obtener un obituario por ID
export const getObituarioById = async (req: Request, res: Response) => {
  try {
    const obituario = await prisma.obituario.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!obituario) return res.status(404).json({ error: 'No encontrado' });
    res.json(obituario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener obituario' });
  }
};