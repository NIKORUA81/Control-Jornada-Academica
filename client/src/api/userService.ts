import apiClient from './apiClient';

// Define la estructura de los datos de un usuario que vienen de la API
export interface ApiUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

// Función para obtener la lista de todos los usuarios
export const getUsers = async (): Promise<ApiUser[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

// Función para actualizar un usuario por su ID
export const updateUser = async (userId: string, data: Partial<ApiUser>): Promise<ApiUser> => {
  const response = await apiClient.patch(`/users/${userId}`, data);
  return response.data;
};