import apiClient from './apiClient';

// Define la "forma" de los datos que esperamos del backend
export interface DashboardStats {
  totalUsers: number;
  totalSubjects: number;
  totalSchedules: number;
  totalGroups: number;
}

// La función que realmente hace la llamada a la API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};