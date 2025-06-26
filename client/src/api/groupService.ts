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
export const createGroup = async (groupData: any): Promise<ApiGroup> => {
  const { data } = await apiClient.post('/groups', groupData);
  return data;
};