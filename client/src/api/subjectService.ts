import apiClient from './apiClient';

export interface ApiSubject {
  id: string;
  name: string;
  code: string;
  credits: number;
}

export const getSubjects = async (): Promise<ApiSubject[]> => {
  const { data } = await apiClient.get('/subjects');
  return data;
};

// --- FUNCIÓN FALTANTE AÑADIDA ---
export const createSubject = async (subjectData: any): Promise<ApiSubject> => {
  const { data } = await apiClient.post('/subjects', subjectData);
  return data;
};