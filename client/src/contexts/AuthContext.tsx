import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// La importación correcta para React 18+
import { useSyncExternalStore } from 'react'; 
import { loginUser, registerUser, logoutUser } from '@/api/authService';
import apiClient from '@/api/apiClient';
import type { LoginFormData, RegisterFormData } from '@/features/auth/components/schemas';

// ... (El resto del código de este archivo que te di en la respuesta anterior es correcto)
// --- El contenido completo para evitar dudas ---

let listeners: (() => void)[] = [];

function emitChange() {
  for (const listener of listeners) { listener(); }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => { listeners = listeners.filter(l => l !== listener); };
}

function getSnapshot() {
  try { return localStorage.getItem('authToken'); } 
  catch (error) { return null; }
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSyncExternalStore(subscribe, getSnapshot);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetUser = useCallback(async () => {
    if (token) {
      try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await apiClient.get<AuthUser>('/auth/profile');
        setUser(response.data);
      } catch (error) {
        logoutUser();
        setUser(null);
        emitChange();
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  const login = async (credentials: LoginFormData) => {
    try {
      const { user: loggedInUser, token: newToken } = await loginUser(credentials);
      localStorage.setItem('authToken', newToken);
      setUser(loggedInUser);
      emitChange();
    } catch (error) {
      logout();
      throw error;
    }
  };

  const register = async (userData: RegisterFormData) => {
    const dataToSend = { ...userData, role: 'DOCENTE' };
    await registerUser(dataToSend);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    emitChange();
  };

  const value = { user, isAuthenticated: !!user && !!token, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }
  return context;
};