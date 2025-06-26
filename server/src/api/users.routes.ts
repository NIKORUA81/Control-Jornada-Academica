// src/api/users.routes.ts

import { Router } from 'express';

// Asegúrate de que la ruta al controlador sea correcta: '../controllers/users.controller'
import { getAllUsersController, updateUserController } from '../controllers/users.controller';

// Asegúrate de que la ruta al middleware sea correcta: '../middleware/auth.middleware'
import { authMiddleware } from '../middleware/auth.middleware';

const userRouter = Router();

// Aplicamos el middleware a todas las rutas de este enrutador
userRouter.use(authMiddleware);

// Definimos las rutas
userRouter.get('/', getAllUsersController);
userRouter.patch('/:id', updateUserController);

// Exportamos el enrutador
export { userRouter };