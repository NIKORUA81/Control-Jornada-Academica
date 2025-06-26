import prisma from '../config/database';
import { Schedule } from '@prisma/client';

export const getSchedulesService = async () => {
  return await prisma.schedule.findMany({
    orderBy: { fecha: 'desc' },
    include: {
      teacher: { select: { fullName: true } },
      subject: { select: { name: true, code: true } },
      group: { select: { name: true } },
    },
  });
};

export type CreateScheduleData = Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'cumplido' | 'fecha_cumplimiento' | 'estado' | 'horas_programadas'>;

// Crea un nuevo cronograma
export const createScheduleService = async (data: CreateScheduleData): Promise<Schedule> => {
  return await prisma.schedule.create({ data });
};

// Marca un cronograma como cumplido
export const markScheduleAsCompleteService = async (scheduleId: string): Promise<Schedule> => {
  return await prisma.schedule.update({
    where: { id: scheduleId },
    data: {
      cumplido: true,
      fecha_cumplimiento: new Date(),
      estado: 'COMPLETADO',
    },
  });
};