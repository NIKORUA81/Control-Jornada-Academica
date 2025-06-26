import { Request, Response } from 'express';
import { getSchedulesService, createScheduleService, markScheduleAsCompleteService } from '../services/schedule.service';

export const getSchedulesController = async (req: Request, res: Response) => {
  try {
    const schedules = await getSchedulesService();
    res.status(200).json(schedules);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los cronogramas', error: error.message });
  }
};

// --- NUEVO CONTROLADOR PARA CREAR ---
export const createScheduleController = async (req: Request, res: Response) => {
  try {
    const newSchedule = await createScheduleService(req.body);
    res.status(201).json(newSchedule);
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear el cronograma', error: error.message });
  }
};

// --- NUEVO CONTROLADOR PARA MARCAR CUMPLIMIENTO ---
export const markScheduleAsCompleteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtenemos el ID de la URL
    const updatedSchedule = await markScheduleAsCompleteService(id);
    res.status(200).json(updatedSchedule);
  } catch (error: any) {
    res.status(404).json({ message: 'Error al actualizar el cronograma', error: error.message });
  }
};