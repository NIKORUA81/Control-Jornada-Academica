//import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/api/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// --- IMPORTACIONES CORREGIDAS ---
// Solo importamos los íconos que realmente usamos en esta versión del dashboard.
import { Calendar, Check, Clock } from 'lucide-react'; 
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard = () => {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">No se pudieron cargar las estadísticas.</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* --- JSX CORREGIDO --- */}
      {/* El grid ahora es de 3 columnas para coincidir con el diseño de la imagen de referencia */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jornadas de Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalSchedules ?? 0}</p>
            <p className="text-xs text-muted-foreground">Clases programadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Estos datos aún son estáticos, los conectaremos después si es necesario */}
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">De {stats?.totalSchedules ?? 0} jornadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Horas del Mes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Total cumplidas</p>
          </CardContent>
        </Card>
      </div>

      {/* La tarjeta de Actividad Reciente que también se ve en la imagen */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <p className="text-sm text-muted-foreground">Últimas acciones en el sistema</p>
        </CardHeader>
        <CardContent>
          {/* Aquí puedes añadir la lista de actividades */}
          <p>Aún no hay actividad reciente.</p>
        </CardContent>
      </Card>
    </div>
  );
};