import { Router } from 'express';
import { 
  getSchedulesController, 
  createScheduleController, 
  markScheduleAsCompleteController,
  getScheduleByIdController,
  updateScheduleController,
  deleteScheduleController,
  getFilteredSchedulesController // Importar el nuevo controlador específico
} from '../controllers/schedule.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { validateRequestBody, validateRequestQuery } from '../middleware/validateRequest'; // validateRequestQuery
import { createScheduleSchema, updateScheduleSchema } from '../dtos/schedule.dto';
import { scheduleReportFilterSchema } from '../dtos/scheduleReportFilter.dto'; // Esquema para filtros

const scheduleRouter = Router();

scheduleRouter.use(authMiddleware); // Aplicar autenticación a todas las rutas de cronogramas

// --- GET /api/schedules ---
// Cualquiera autenticado puede ver la lista general
scheduleRouter.get('/', getSchedulesController);

// --- GET /api/schedules/filtered ---
// Ruta para obtener cronogramas filtrados para reportes (solo Admin/Superadmin)
scheduleRouter.get(
  '/filtered', // Podría ser /reports/schedules si se prefiere agrupar rutas de reportes
  checkRole(['ADMIN', 'SUPERADMIN']), // Asegurar que solo roles autorizados puedan acceder
  validateRequestQuery(scheduleReportFilterSchema),
  getFilteredSchedulesController // Usar el controlador específico
);

// --- GET /api/schedules/:id ---
// Cualquiera autenticado puede ver un cronograma específico por ID
scheduleRouter.get('/:id', getScheduleByIdController);


// --- POST /api/schedules ---
// Solo roles de gestión pueden crear, con validación de entrada
scheduleRouter.post(
  '/', 
  checkRole(['ADMIN', 'SUPERADMIN', 'COORDINADOR', 'ASISTENTE']), // Roles que pueden crear
  validateRequestBody(createScheduleSchema), // Validar el cuerpo de la solicitud
  createScheduleController
);

// --- PATCH /api/schedules/:id ---
// Solo roles de gestión pueden actualizar, con validación de entrada
scheduleRouter.patch(
  '/:id',
  checkRole(['ADMIN', 'SUPERADMIN', 'COORDINADOR', 'ASISTENTE']), // Roles que pueden actualizar
  validateRequestBody(updateScheduleSchema), // Validar el cuerpo de la solicitud (parcial)
  updateScheduleController
);

// --- DELETE /api/schedules/:id ---
// Solo roles de alta jerarquía pueden eliminar
scheduleRouter.delete(
  '/:id',
  checkRole(['ADMIN', 'SUPERADMIN']), // Roles que pueden eliminar
  deleteScheduleController
);

// --- PATCH /api/schedules/:id/complete ---
// Solo un DOCENTE (o roles superiores si fuera necesario) puede marcar una jornada como cumplida
scheduleRouter.patch(
  '/:id/complete', 
  checkRole(['DOCENTE', 'ADMIN', 'SUPERADMIN']),
  markScheduleAsCompleteController
);

export { scheduleRouter };