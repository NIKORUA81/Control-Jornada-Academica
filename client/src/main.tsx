// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/providers/theme-provider'

import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

// 1. Crear una instancia del cliente de React Query.
const queryClient = new QueryClient();

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("No se encontró el elemento raíz 'root' en el DOM.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);