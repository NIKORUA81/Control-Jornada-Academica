// src/api/users.routes.ts

import { Router } from 'express';

// Asegúrate de que la ruta al controlador sea correcta: '../controllers/users.controller'
import { getAllUsersController, updateUserController, createUserController } from '../controllers/users.controller'; // Añadir createUserController
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware'; // Importar checkRole para proteger la creación

const userRouter = Router();

// Aplicamos el middleware de autenticación a todas las rutas de este enrutador
userRouter.use(authMiddleware);

// Definimos las rutas
userRouter.get('/', getAllUsersController);

// Ruta para crear un nuevo usuario. Protegida por roles.
// Solo ADMIN o SUPERADMIN pueden crear usuarios. Ajustar roles según necesidad.
userRouter.post(
    '/',
    checkRole(['ADMIN', 'SUPERADMIN']), // Proteger la creación de usuarios
    createUserController
);

userRouter.patch('/:id', updateUserController); // Asumimos que la lógica de quién puede actualizar a quién está en el servicio/controlador

// Exportamos el enrutador
export { userRouter };