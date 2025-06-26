// src/api/auth.routes.ts
import { Router } from 'express';
import { registerController, loginController, getProfileController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware'; // Importa el middleware

const authRouter = Router(); // Renombrado para mayor claridad

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/profile', authMiddleware, getProfileController);

export { authRouter }; // <-- Cambia a una exportación nombrada