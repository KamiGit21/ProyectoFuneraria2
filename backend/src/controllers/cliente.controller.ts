import { RequestHandler } from 'express';
import prisma from '../config/prismaClient';
import bcrypt from 'bcrypt';

export const crearCliente: RequestHandler = async (req, res) => {
  const { nombres, apellidos, email, telefono, direccion, password } = req.body;

  if (!nombres || !apellidos || !email || !password) {
    res.status(400).json({ error: 'Campos obligatorios faltantes' });
    return;
  }

  try {
    // Verifica si el email ya está registrado
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      res.status(409).json({ error: 'El email ya está registrado' });
      return;
    }

    // Hashea la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crea el usuario y el perfil de cliente
    const usuario = await prisma.usuario.create({
      data: {
        email,
        password_hash: hash,
        rol: 'CLIENTE',
        perfilCliente: {
          create: { nombres, apellidos, telefono, direccion },
        },
      },
      include: { perfilCliente: true },
    });

    res.status(201).json({ message: 'Cliente creado', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al registrar cliente' });
  }
};
