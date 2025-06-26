/**
 * @file MainLayout.tsx
 * Componente principal de la estructura de la aplicación para usuarios autenticados.
 * Orquesta la barra lateral (Sidebar) y el área de contenido principal,
 * renderizando dinámicamente la vista seleccionada por el usuario.
 */

import React, { useState, useMemo } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { viewConfig } from '@/config/views';
import { useAuth } from '@/contexts/AuthContext';
import { UserEditDialog } from '@/features/userManagement/components/UserEditDialog';
import { ThemeToggle } from './ThemeToggle'; // Importa el botón

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [currentViewId, setCurrentViewId] = useState('dashboard');

  const CurrentViewComponent = useMemo(() => {
    const view = viewConfig.find(v => v.id === currentViewId);
    if (!view || (user && !view.allowedRoles.includes(user.role as any))) {
      const dashboardView = viewConfig.find(v => v.id === 'dashboard');
      // --- CORRECCIÓN: Se usa 'return' correctamente ---
      return dashboardView?.component || (() => <div>Vista no encontrada o sin permisos.</div>);
    }
    return view.component;
  }, [currentViewId, user]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <AppSidebar onNavigate={setCurrentViewId} currentView={currentViewId} />
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="md:hidden" />
            {/* Contenedor para alinear el botón a la derecha */}
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <CurrentViewComponent />
          </main>
        </div>
        {/* --- CORRECCIÓN: Se renderiza el diálogo global --- */}
        <UserEditDialog />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;