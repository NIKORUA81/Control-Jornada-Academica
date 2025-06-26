import { Request, Response } from 'express';
import { getSubjectsService, createSubjectService } from '../services/subject.service';

export const getSubjectsController = async (req: Request, res: Response) => {
  try {
    const subjects = await getSubjectsService();
    res.status(200).json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener las materias', error: error.message });
  }
};

// --- AÑADIR ESTE CONTROLADOR ---
export const createSubjectController = async (req: Request, res: Response) => {
  try {
    const newSubject = await createSubjectService(req.body);
    res.status(201).json(newSubject);
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear la materia', error: error.message });
  }
};