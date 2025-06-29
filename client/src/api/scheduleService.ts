import apiClient from './apiClient';

// Tipo para los filtros que se enviarán a la API
// Debería coincidir con ScheduleReportFilterDto del backend en términos de campos opcionales
export interface ScheduleFilters {
  teacherId?: string; // 'all' se omitirá o se enviará como undefined
  month?: string;     // 'all' se omitirá
  year?: string;      // 'all' se omitirá
  subjectId?: string; // 'all' se omitirá
  groupId?: string;   // 'all' se omitirá
  status?: string;    // 'all' se omitirá
  modality?: string;  // 'all' se omitirá
  // page?: number;
  // limit?: number;
}

export interface ApiSchedule {
  id: string;
  fecha: string; // Se mantiene como string (ISO date) desde la API
  hora_inicio: number; // CAMBIO: ahora es number (minutos desde medianoche)
  hora_fin: number;    // CAMBIO: ahora es number (minutos desde medianoche)
  estado: string; // Debería ser el tipo ScheduleStatus del backend
  teacher: {
    id: string; // Añadir ID si no está
    fullName: string;
  };
  subject: {
    id: string; // Añadir ID
    name: string;
    code: string;
  };
  group: {
    id: string; // Añadir ID
    name: string;
  };
  modalidad: string; // Debería ser el tipo Modality del backend
  aula: string | null;
  observaciones: string | null;
  cumplido: boolean; // No es null en el modelo Prisma, default es false
  fecha_cumplimiento: string | null; // Sigue siendo string (ISO datetime) o null
  // createdAt, updatedAt si son necesarios
}

export const getSchedules = async (): Promise<ApiSchedule[]> => {
  const response = await apiClient.get('/schedules');
  return response.data;
};

export const markScheduleAsComplete = async (scheduleId: string): Promise<ApiSchedule> => {
  const response = await apiClient.patch(`/schedules/${scheduleId}/complete`);
  return response.data;
};

// --- FUNCIÓN FALTANTE AÑADIDA Y EXPORTADA ---
// El tipo 'any' para scheduleData debería ser reemplazado por un DTO del frontend
// ej. ClientCreateScheduleDto que se mapea a CreateScheduleDto del backend
export interface ClientCreateSchedulePayload {
  fecha: string; // YYYY-MM-DD string
  hora_inicio: number; // minutos
  hora_fin: number; // minutos
  modalidad: string; // Debería ser uno de los valores del enum Modality
  aula?: string | null;
  teacherId: string; // UUID
  subjectId: string; // UUID
  groupId: string; // UUID
  observaciones?: string | null;
}

export const createSchedule = async (scheduleData: ClientCreateSchedulePayload): Promise<ApiSchedule> => {
  const response = await apiClient.post('/schedules', scheduleData);
  return response.data;
};

// --- NUEVA FUNCIÓN PARA OBTENER HORARIOS FILTRADOS ---
export const getFilteredSchedules = async (filters: ScheduleFilters): Promise<ApiSchedule[]> => {
  // Limpiar filtros: eliminar claves con valor 'all' o undefined/null antes de enviar
  const cleanedFilters: Record<string, string> = {};
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const value = filters[key as keyof ScheduleFilters];
      if (value && value !== 'all') {
        cleanedFilters[key] = String(value); // Asegurar que todos los valores sean strings para query params
      }
    }
  }

  const response = await apiClient.get('/schedules/filtered', {
    params: cleanedFilters,
  });
  return response.data;
};