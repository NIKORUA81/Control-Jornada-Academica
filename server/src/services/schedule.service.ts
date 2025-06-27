import prisma from '../config/database';
import { Schedule, Prisma } from '@prisma/client'; // Importar Prisma para tipos de input si es necesario
import { CreateScheduleDto, UpdateScheduleDto } from '../dtos/schedule.dto'; // Importar nuestros DTOs

export const getSchedulesService = async () => {
  return await prisma.schedule.findMany({
    orderBy: { fecha: 'desc' },
    include: {
      teacher: { select: { id:true, fullName: true } }, // Devolver ID también puede ser útil
      subject: { select: { id:true, name: true, code: true } },
      group: { select: { id:true, name: true } },
    },
  });
  // Los campos hora_inicio y hora_fin se devolverán como enteros (minutos)
};

// Crea un nuevo cronograma
// 'data' ya viene validada y con los tipos correctos desde el controlador (gracias al DTO y middleware)
// fecha es Date, hora_inicio y hora_fin son number (minutos)
export const createScheduleService = async (data: CreateScheduleDto): Promise<Schedule> => {
  // Los campos en CreateScheduleDto (fecha, hora_inicio, hora_fin, modalidad, aula, teacherId, subjectId, groupId, observaciones)
  // coinciden con lo que Prisma espera para la creación, asumiendo que los nombres de campo son los mismos.
  // Prisma tomará los valores por defecto para 'estado', 'cumplido', etc., según el schema.prisma.
  return await prisma.schedule.create({
    data: {
      ...data, // Esto incluye fecha (Date), hora_inicio (Int), hora_fin (Int) y los IDs de relación
    }
  });
};

// Actualiza un cronograma existente
export const updateScheduleService = async (scheduleId: string, data: UpdateScheduleDto): Promise<Schedule | null> => {
  // data es un objeto parcial con campos validados de UpdateScheduleDto
  // Si fecha, hora_inicio, hora_fin están presentes, ya son del tipo correcto (Date, number)
  try {
    return await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        ...data,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      // P2025: "An operation failed because it depends on one or more records that were required but not found." (Registro no encontrado)
      return null;
    }
    throw error; // Re-lanzar otros errores
  }
};


// Marca un cronograma como cumplido
export const markScheduleAsCompleteService = async (scheduleId: string): Promise<Schedule | null> => {
  try {
    return await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        cumplido: true,
        fecha_cumplimiento: new Date(),
        estado: 'COMPLETADO', // Asegurarse que 'COMPLETADO' es un valor válido del enum ScheduleStatus
      },
    });
  } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

// --- NUEVO SERVICIO PARA OBTENER HORARIOS FILTRADOS ---
export const getFilteredSchedulesService = async (filters: ScheduleReportFilterDto): Promise<Schedule[]> => {
  const whereClause: Prisma.ScheduleWhereInput = {};

  if (filters.teacherId) {
    whereClause.teacherId = filters.teacherId;
  }
  if (filters.subjectId) {
    whereClause.subjectId = filters.subjectId;
  }
  if (filters.groupId) {
    whereClause.groupId = filters.groupId;
  }
  if (filters.status) {
    whereClause.estado = filters.status;
  }
  if (filters.modalidad) {
    whereClause.modalidad = filters.modalidad;
  }

  // Filtro por mes y año (requiere que 'fecha' sea un campo DateTime en la DB)
  if (filters.year) {
    const year = filters.year;
    if (filters.month) {
      const month = filters.month; // 1-12
      // Construir rango de fechas para el mes y año especificados
      // Meses en JavaScript Date son 0-indexados (0 para Enero, 11 para Diciembre)
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // Último día del mes

      whereClause.fecha = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      // Solo año, obtener todos los schedules de ese año
      const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0)); // Enero 1
      const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // Diciembre 31
      whereClause.fecha = {
        gte: startDate,
        lte: endDate,
      };
    }
  }
  // Nota: Si solo se proporciona el mes sin el año, este filtro podría ser ambiguo o no aplicarse.
  // El DTO actual hace que el año sea requerido si el mes está presente debido a la lógica de dependencia implícita,
  // o podríamos hacer el año opcional y si solo hay mes, ignorarlo o tomar el año actual.
  // Por ahora, la validación Zod asegura que si se da el mes, el año también (o se puede ajustar el Zod schema).
  // La lógica actual del DTO con `optionalWithAll` para `year` y `month` significa que ambos pueden ser undefined.
  // Si `filters.year` está presente, se aplica el filtro de fecha.

  return await prisma.schedule.findMany({
    where: whereClause,
    orderBy: { fecha: 'desc' }, // Opcional: añadir más opciones de ordenación
    include: {
      teacher: { select: { id:true, fullName: true } },
      subject: { select: { id:true, name: true, code: true } },
      group: { select: { id:true, name: true } },
    },
    // Considerar paginación si se añaden page/limit al DTO y se pasan aquí
    // skip: (filters.page - 1) * filters.limit,
    // take: filters.limit,
  });
};


// Podríamos añadir getScheduleByIdService
export const getScheduleByIdService = async (scheduleId: string): Promise<Schedule | null> => {
  return await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      teacher: { select: { id: true, fullName: true } },
      subject: { select: { id: true, name: true, code: true } },
      group: { select: { id: true, name: true } },
    }
  });
};

// Y deleteScheduleService
export const deleteScheduleService = async (scheduleId: string): Promise<Schedule | null> => {
  try {
    return await prisma.schedule.delete({
      where: { id: scheduleId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};