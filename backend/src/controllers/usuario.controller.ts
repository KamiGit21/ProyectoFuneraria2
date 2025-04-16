import { RequestHandler } from 'express';
import prisma from '../config/prismaClient';

// GET /usuarios - Obtener todos los usuarios con sus perfiles
export const obtenerUsuarios: RequestHandler = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        perfilAdmin: true,
        perfilCliente: true,
        perfilOperador: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// PATCH /usuarios/:id - Cambiar estado del usuario
export const cambiarEstadoUsuario: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!id || !estado || !['ACTIVO', 'INACTIVO'].includes(estado)) {
    res.status(400).json({ error: 'ID o estado inválido' });
    return;
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: {
        perfilAdmin: true,
        perfilCliente: true,
        perfilOperador: true,
      },
    });

    res.status(200).json({ message: 'Estado actualizado', usuario: usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado' });
  }
};
