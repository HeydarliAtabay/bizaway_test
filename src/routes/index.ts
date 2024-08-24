import { Router } from 'express';
import tripsRoutes from './endpoints/trips';

const router = Router();

router.use(tripsRoutes);

export default router;
