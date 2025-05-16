import { Router } from 'express';
import * as ctrl from '../controllers/service.controller';
import { authMiddleware, requireRol } from '../middlewares/auth';

const router = Router();

// públicas
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// sólo ADMIN
router.use(authMiddleware, requireRol(['ADMIN']));
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
