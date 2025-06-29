import apiClient from './apiClient';

export interface ApiGroup {
  id: string;
  name: string;
  code: string;
}

export const getGroups = async (): Promise<ApiGroup[]> => {
  const { data } = await apiClient.get('/groups');
  return data;
};

// --- FUNCIÓN FALTANTE AÑADIDA ---
export interface ClientCreateGroupPayload {
  code: string;
  name: string;
  semester: number;
  year: number;
  max_students?: number;
  subjectIds?: string[];
}

export const createGroup = async (groupData: ClientCreateGroupPayload): Promise<ApiGroup> => {
  const { data } = await apiClient.post('/groups', groupData);
  return data;
};