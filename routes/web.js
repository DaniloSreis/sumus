import userRoutes from './userRoutes.js';
import authRoutes from './userRoutes.js';
import { Router } from 'express'

const router = Router()

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;
