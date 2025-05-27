import { Router } from 'express';
import * as ctrl from '../controllers/categoria.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const r = Router();

// público
r.get('/', ctrl.listCategorias);
r.get('/:id/servicios', ctrl.listServiciosPorCategoria);

// privado ADMIN
r.use(authMiddleware, requireRol(['ADMIN']));
r.post('/', ctrl.createCategoria);
r.get('/:id', ctrl.getCategoria);
r.patch('/:id', ctrl.updateCategoria);
r.delete('/:id', ctrl.deleteCategoria);

export default r;
