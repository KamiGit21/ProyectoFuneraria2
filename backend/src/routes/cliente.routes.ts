import { Router } from 'express';
import { crearCliente } from '../controllers/cliente.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// Ruta para registrar cliente (solo para OPERADOR o ADMIN)
router.post('/', authMiddleware, requireRol(['OPERADOR', 'ADMIN']), crearCliente);

export default router;
