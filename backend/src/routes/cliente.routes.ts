import { Router } from 'express';
import { crearCliente } from '../controllers/cliente.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// Se requiere autenticación y que el usuario tenga rol OPERADOR o ADMIN
router.post('/', authMiddleware, requireRol(['OPERADOR', 'ADMIN']), crearCliente);

export default router;
