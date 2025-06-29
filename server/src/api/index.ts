// src/api/index.ts

import { Router } from 'express';
import { authRouter } from './auth.routes';
import { dashboardRouter } from './dashboard.routes';
import { userRouter } from './users.routes';
import { subjectRouter } from './subject.routes';
import { groupRouter } from './group.routes';
import { scheduleRouter } from './schedule.routes'; // <-- Importa el router de cronogramas

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/dashboard', dashboardRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/subjects', subjectRouter);
mainRouter.use('/groups', groupRouter);

// El comentario siguiente parece referirse a una corrección histórica en la rama entrante.
// Lo mantenemos por si da contexto, pero funcionalmente la línea importante es la siguiente.
// --- LÍNEA FALTANTE AÑADIDA ---
// Ahora Express sabe qué hacer con las peticiones a /api/schedules
mainRouter.use('/schedules', scheduleRouter);

export default mainRouter;