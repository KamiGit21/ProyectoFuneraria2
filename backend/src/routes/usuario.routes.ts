import { Router } from 'express';
import { obtenerUsuarios, cambiarEstadoUsuario } from '../controllers/usuario.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';
import { actualizarEstadoUsuario } from "../controllers/usuario.controller";

const router = Router();

// Se requiere autenticación y que el usuario tenga rol ADMIN
router.get('/', authMiddleware, requireRol(['ADMIN']), obtenerUsuarios);
router.patch('/:id', verificaToken, verificaAdminRole, actualizarEstadoUsuario);


export default router;


