// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Permite iniciar sesión con email **o** nombre_usuario
 * Body esperado: { login: string, password: string }
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { login: loginField, password } = req.body;
  if (!loginField || !password) {
    res.status(400).json({ error: 'Usuario/Email y contraseña son requeridos.' });
    return;
  }

  try {
    // Buscar usuario por email o nombre de usuario
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: loginField }, { nombre_usuario: loginField }],
      },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // Convertir el BigInt a string (o Number) antes de generar el JWT
    const userId = usuario.id.toString();

    const token = jwt.sign(
      { id: userId, rol: usuario.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    // Devolver la respuesta con el ID ya serializado
    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: userId,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno.' });
  }
};
