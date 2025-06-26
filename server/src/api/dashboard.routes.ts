import { Router } from 'express';
import { getDashboardStatsController } from '../controllers/dashboard.controller';

const dashboardRouter = Router();

// La ruta aquí es '/stats', que se combinará con '/dashboard' más adelante.
dashboardRouter.get('/stats', getDashboardStatsController);

// ¡Asegúrate de que estás exportando el router!
export { dashboardRouter };