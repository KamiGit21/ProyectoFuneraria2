//backend/src/routes/order.routes.ts
import { Router } from 'express';
import { authMiddleware, requireRol } from '../middlewares/auth';
import * as ctrl from '../controllers/order.controller';

const r = Router();

r.use(authMiddleware);

/* cliente / operador */
r.post('/', requireRol(['CLIENTE', 'OPERADOR']), ctrl.create);
r.get('/mias', requireRol(['CLIENTE']), ctrl.listMine);

/* operador + admin */
r.patch('/:id/estado', requireRol(['OPERADOR', 'ADMIN']), ctrl.changeStatus);

/* cualquiera autenticado ve su orden */
r.get('/:id', ctrl.get);

export default r;
