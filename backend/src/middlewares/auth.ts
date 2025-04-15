// backend/src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Si usas TypeScript, añade la propiedad 'user' en el Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware de autenticación.
 * Verifica el token JWT enviado en el header Authorization (formato "Bearer token").
 * Si el token es válido, agrega req.user y llama a next().
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'No se proporcionó token de autenticación.' });
    return;
  }
  const token = authHeader.split(' ')[1]; // Asume formato "Bearer <token>"
  if (!token) {
    res.status(401).json({ error: 'Token inválido.' });
    return;
  }
  try {
    // Verifica el token con la clave secreta definida en .env (JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Guarda el payload del token en req.user
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware para requerir roles específicos.
 * Recibe un arreglo de roles permitidos y comprueba que el rol del usuario esté entre ellos.
 * Si no, responde con error 403.
 */
export const requireRol = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado.' });
      return;
    }
    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción.' });
      return;
    }
    next();
  };
};
