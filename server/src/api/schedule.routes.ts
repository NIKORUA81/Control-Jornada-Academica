import { Router } from 'express';
import { 
  getSchedulesController, 
  createScheduleController, 
  markScheduleAsCompleteController 
} from '../controllers/schedule.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const scheduleRouter = Router();

scheduleRouter.use(authMiddleware);

// Cualquiera autenticado puede ver la lista general
scheduleRouter.get('/', getSchedulesController);

// Solo roles de gestión pueden crear
scheduleRouter.post(
  '/', 
  checkRole(['ADMIN', 'SUPERADMIN', 'COORDINADOR', 'ASISTENTE']),
  createScheduleController
);

// --- MEJORA ---
// Solo un docente puede marcar una jornada como cumplida
scheduleRouter.patch(
  '/:id/complete', 
  checkRole(['DOCENTE']),
  markScheduleAsCompleteController
);

export { scheduleRouter };