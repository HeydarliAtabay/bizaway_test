// Routes of application
import { Router } from 'express';
import tripsRoutes from './endpoints/trips';
import tripsManagerRoutes from './endpoints/tripManager'

const router = Router();

router.use(tripsRoutes);
router.use(tripsManagerRoutes)

export default router;
