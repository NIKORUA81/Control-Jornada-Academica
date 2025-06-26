import { Router } from 'express';
import { getSubjectsController, createSubjectController } from '../controllers/subject.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const subjectRouter = Router();
subjectRouter.use(authMiddleware);

subjectRouter.get('/', getSubjectsController);
subjectRouter.post('/', createSubjectController);

export { subjectRouter };