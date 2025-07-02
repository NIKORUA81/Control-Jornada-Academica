import { Request, Response } from 'express';
import {
  getSchedulesService,
  createScheduleService,
  markScheduleAsCompleteService,
  updateScheduleService, // Importar el servicio de actualización
  getScheduleByIdService,
  deleteScheduleService,
  getFilteredSchedulesService // Importar el nuevo servicio
} from '../services/schedule.service';
import { CreateSchedule, UpdateScheduleDto } from '../dtos/schedule.dto';
import { ScheduleReportFilterDto } from '../dtos/scheduleReportFilter.dto'; // DTO para filtros
import { Prisma } from '@prisma/client';

export const getSchedulesController = async (req: Request, res: Response) => {
  try {
    const schedules = await getSchedulesService();
    res.status(200).json(schedules);
  } catch (error: any) {
    console.error("Error en getSchedulesController:", error);
    res.status(500).json({ message: 'Error al obtener los cronogramas.', error: error.message });
  }
};

export const getScheduleByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const schedule = await getScheduleByIdService(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Cronograma no encontrado.' });
    }
    res.status(200).json(schedule);
  } catch (error: any) {
    console.error(`Error en getScheduleByIdController (id: ${req.params.id}):`, error);
    res.status(500).json({ message: 'Error al obtener el cronograma.', error: error.message });
  }
};

export const createScheduleController = async (req: Request, res: Response) => {
  try {
    // req.body ya es CreateScheduleDto gracias al middleware de validación que se aplicará en las rutas
    const scheduleData: CreateSchedule = req.body;
    const newSchedule = await createScheduleService(scheduleData);
    res.status(201).json(newSchedule);
  } catch (error: any) {
    console.error("Error en createScheduleController:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint failed (ej. si hubiera un constraint único en schedule)
        return res.status(409).json({ message: 'Error al crear el cronograma: Conflicto de datos (ej. registro duplicado).', details: error.meta });
      }
       // Manejar otros errores de Prisma relacionados con relaciones, etc.
      if (error.code === 'P2025') { // Foreign key constraint failed
         return res.status(400).json({ message: 'Error al crear el cronograma: Uno o más IDs relacionados (docente, materia, grupo) no existen.', details: error.meta });
      }
    }
    res.status(400).json({ message: 'Error al crear el cronograma.', error: error.message });
  }
};

export const updateScheduleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // req.body ya es UpdateScheduleDto gracias al middleware de validación
    const scheduleData: UpdateScheduleDto = req.body;
    const updatedSchedule = await updateScheduleService(id, scheduleData);
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Cronograma no encontrado para actualizar.' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error: any) {
    console.error(`Error en updateScheduleController (id: ${req.params.id}):`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
       return res.status(409).json({ message: 'Error al actualizar el cronograma: Conflicto de datos.', details: error.meta });
    }
    res.status(400).json({ message: 'Error al actualizar el cronograma.', error: error.message });
  }
};

export const deleteScheduleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSchedule = await deleteScheduleService(id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Cronograma no encontrado para eliminar.' });
    }
    res.status(200).json({ message: 'Cronograma eliminado exitosamente.', schedule: deletedSchedule });
  } catch (error: any) {
    console.error(`Error en deleteScheduleController (id: ${req.params.id}):`, error);
    res.status(500).json({ message: 'Error al eliminar el cronograma.', error: error.message });
  }
};

export const markScheduleAsCompleteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedSchedule = await markScheduleAsCompleteService(id);
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Cronograma no encontrado para marcar como completado.' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error: any) {
    console.error(`Error en markScheduleAsCompleteController (id: ${req.params.id}):`, error);
    res.status(400).json({ message: 'Error al marcar el cronograma como completado.', error: error.message });
  }
};

// --- NUEVO CONTROLADOR PARA OBTENER HORARIOS FILTRADOS ---
export const getFilteredSchedulesController = async (req: Request, res: Response) => {
  try {
    // req.query ya ha sido validado por el middleware validateRequestQuery
    // y se ajusta al tipo ScheduleReportFilterDto.
    const filters: ScheduleReportFilterDto = req.query as any; // Castear si es necesario, aunque Zod debería haberlo conformado

    const schedules = await getFilteredSchedulesService(filters);
    res.status(200).json(schedules);
  } catch (error: any) {
    console.error("Error en getFilteredSchedulesController:", error);
    res.status(500).json({ message: 'Error al obtener los cronogramas filtrados.', error: error.message });
  }
};