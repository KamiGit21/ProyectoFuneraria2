import { Router } from 'express';
import { getObituarios, createObituario, getObituarioById } from '../controllers/obituarios.controller';

const router = Router();

router.get('/', getObituarios);
router.post('/', createObituario);
router.get('/:id', getObituarioById);

export default router;