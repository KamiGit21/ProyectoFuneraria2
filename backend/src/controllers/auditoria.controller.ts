import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { user, tabla, date, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (user) where.usuario = { nombre_usuario: { contains: user as string } };
    if (tabla) where.tabla = tabla as string;
    if (date) where.realizado_en = { gte: new Date(date as string), lte: new Date(date as string + 'T23:59:59.999Z') };

    const [logs, total] = await Promise.all([
      prisma.auditoria.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { realizado_en: 'desc' },
        select: {
          id: true,
          usuario_id: true,
          tabla: true,
          operacion: true,
          realizado_en: true,
          usuario: { select: { nombre_usuario: true } },
        },
      }),
      prisma.auditoria.count({ where }),
    ]);

    const formattedLogs = logs.map(log => ({
      id: log.id,
      user: log.usuario?.nombre_usuario || 'Sistema',
      tabla: log.tabla,
      operacion: log.operacion,
      realizado_en: log.realizado_en.toISOString(),
    }));

    return res.status(200).json({ logs: formattedLogs, total });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ error: 'Error al obtener los registros de auditoría' });
  }
};