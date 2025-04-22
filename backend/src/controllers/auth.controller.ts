import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  id: string;   // <-- como string
  rol: string;
}

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
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: loginField }, { nombre_usuario: loginField }],
      },
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // ⇒ Coerción de BigInt a string
    const payload: JwtPayload = {
      id: usuario.id.toString(),
      rol: usuario.rol,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario.id.toString(),           // <-- string
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno.' });
  }
};
