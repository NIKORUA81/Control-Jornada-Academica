// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Lee la URL de la API desde .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor para añadir el Token JWT a las peticiones ---
// Esto es crucial. Cada vez que hagamos una petición a una ruta protegida,
// este interceptor añadirá el token de autenticación automáticamente.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

localStorage.getItem('authToken')