import { Router } from 'express';
import { getGroupsController } from '../controllers/group.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { createGroupController } from '../controllers/group.controller';

const groupRouter = Router();

groupRouter.use(authMiddleware);
groupRouter.get('/', getGroupsController);

// --- CORRECCIÓN: Añade la ruta POST ---
groupRouter.post('/', createGroupController);

export { groupRouter };






