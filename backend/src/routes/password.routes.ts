import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/password.controller';

const router = Router();

// No requiere auth
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

export default router;
