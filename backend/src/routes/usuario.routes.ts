import { Router } from 'express';
import { obtenerUsuarios, cambiarEstadoUsuario } from '../controllers/usuario.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// Se requiere autenticación y rol ADMIN para ver y editar usuarios
router.get('/', authMiddleware, requireRol(['ADMIN']), obtenerUsuarios);
router.patch('/:id', authMiddleware, requireRol(['ADMIN']), cambiarEstadoUsuario);

export default router;
