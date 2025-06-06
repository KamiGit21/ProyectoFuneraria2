// routes/faq.routes.ts

import express from 'express';
import { getAllFaq } from '../controllers/faq.controller';

const router = express.Router();

router.get('/', getAllFaq);

export default router;