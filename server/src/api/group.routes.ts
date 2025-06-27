import { Router } from 'express';
import { getGroupsController, createGroupController } from '../controllers/group.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware'; // Asumiendo que la creación de grupos también debe ser protegida por roles
import { validateRequestBody } from '../middleware/validateRequest'; // Importar el middleware de validación
import { createGroupSchema } from '../dtos/group.dto'; // Importar el esquema Zod

const groupRouter = Router();

groupRouter.use(authMiddleware); // Aplicar autenticación a todas las rutas de grupos

// Obtener todos los grupos (cualquier usuario autenticado)
groupRouter.get('/', getGroupsController);

// Crear un nuevo grupo
// Protegido por roles (ej. ADMIN, SUPERADMIN, COORDINADOR) y con validación de entrada
groupRouter.post(
  '/',
  checkRole(['ADMIN', 'SUPERADMIN', 'COORDINADOR']), // Ajustar roles según sea necesario
  validateRequestBody(createGroupSchema), // Aplicar el middleware de validación con el esquema
  createGroupController
);

// Aquí podrían ir otras rutas para grupos (ej. GET /:id, PATCH /:id, DELETE /:id)
// cada una con sus respectivos middlewares de protección y validación si es necesario.

export { groupRouter };