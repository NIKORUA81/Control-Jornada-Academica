// src/api/authService.ts
import apiClient from './apiClient';

// Definimos los tipos para que coincidan con los que espera el AuthContext
interface UserCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    username: string;
    fullName: string;
    password: string;
    role: string;
}

// Función para registrar un nuevo usuario
export const registerUser = async (userData: RegisterData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Función para iniciar sesión
export const loginUser = async (credentials: UserCredentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  
  // Si el login es exitoso, el backend nos devuelve un token.
  // Lo guardamos en el localStorage para mantener la sesión.
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  
  return response.data;
};

// Función para cerrar sesión
export const logoutUser = () => {
  // Simplemente eliminamos el token del almacenamiento local.
  // No necesitamos llamar a la API para esto, a menos que tuviéramos una lista de tokens activos en el backend.
  localStorage.removeItem('authToken');
};