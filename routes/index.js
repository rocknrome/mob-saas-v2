import { Router } from 'express';
import clientRoutes from './clientRoutes.js'; // Example route for clients

const router = Router();

router.use('/clients', clientRoutes);

export default router;
