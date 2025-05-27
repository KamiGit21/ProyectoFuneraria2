import { Router } from 'express';
import { obtenerUsuarios, crearUsuario, cambiarEstadoUsuario, eliminarUsuario } from '../controllers/usuario.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// Se requiere autenticación y rol ADMIN para ver y editar usuarios
router.get('/', authMiddleware, requireRol(['ADMIN']), obtenerUsuarios);
router.post('/', authMiddleware, requireRol(['ADMIN']), crearUsuario);
router.patch('/:id', authMiddleware, requireRol(['ADMIN']), cambiarEstadoUsuario);
router.delete('/:id', authMiddleware, requireRol(['ADMIN']), eliminarUsuario);

export default router;
