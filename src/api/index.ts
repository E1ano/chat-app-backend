import { Router } from 'express';
import authRoutes from './auth/index.js';

const router = Router();

router.use('/auth', authRoutes);
// chat routes will go here

export default router;
