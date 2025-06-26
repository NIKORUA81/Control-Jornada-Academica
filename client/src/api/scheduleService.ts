import apiClient from './apiClient';

export interface ApiSchedule {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  teacher: {
    fullName: string;
  };
  subject: {
    name: string;
    code: string;
  };
  group: {
    name: string;
  };
  modalidad: string;
  cumplido: boolean | null;
  fecha_cumplimiento: string | null;
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
export const createSchedule = async (scheduleData: any): Promise<ApiSchedule> => {
  const response = await apiClient.post('/schedules', scheduleData);
  return response.data;
};