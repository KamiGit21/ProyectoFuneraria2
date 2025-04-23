import { Router } from 'express'
import { registerClient, verifyCode } from '../controllers/public.controller'

const router = Router()

// POST /api/public/register  → crea usuario + envía código
router.post('/register', registerClient)

// POST /api/public/verify    → activa cuenta
router.post('/verify', verifyCode)

export default router
