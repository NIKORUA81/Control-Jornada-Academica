import apiClient from './apiClient';
import type { CreateUserFormData, UpdateUserFormData } from '@/features/userManagement/components/userSchemas';

// Define la estructura de los datos de un usuario que vienen de la API
export interface ApiUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: string; // Debería ser compatible con los valores de Zod Enum: 'DOCENTE', 'COORDINADOR', etc.
    isActive: boolean;
    createdAt: string; // Podría ser Date si se transforma
    updatedAt?: string; // Podría ser Date
}

// Payload para la creación, sin confirmPassword
export type CreateUserPayload = Omit<CreateUserFormData, 'confirmPassword'>;

// Función para obtener la lista de todos los usuarios
export const getUsers = async (): Promise<ApiUser[]> => {
  const response = await apiClient.get<ApiUser[]>('/users');
  return response.data;
};

// Función para crear un nuevo usuario
export const createUser = async (userData: CreateUserPayload): Promise<ApiUser> => {
  const response = await apiClient.post<ApiUser>('/users', userData);
  return response.data;
};

// Función para actualizar un usuario por su ID
// Ahora espera UpdateUserFormData, que es más específico que Partial<ApiUser>
// y coincide con lo que el UserForm con updateUserSchema proporcionará.
export const updateUser = async (userId: string, userData: UpdateUserFormData): Promise<ApiUser> => {
  const response = await apiClient.patch<ApiUser>(`/users/${userId}`, userData);
  return response.data;
};

// Podríamos añadir funciones para obtener un usuario por ID, o eliminarlo, etc.
// export const getUserById = async (userId: string): Promise<ApiUser> => {
//   const response = await apiClient.get<ApiUser>(`/users/${userId}`);
//   return response.data;
// };

// export const deleteUser = async (userId: string): Promise<void> => {
//   await apiClient.delete(`/users/${userId}`);
// };