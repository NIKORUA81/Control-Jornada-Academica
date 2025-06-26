/**
 * @file ScheduleManagement.tsx
 * Componente para la gestión y visualización de cronogramas.
 * Adapta su comportamiento y UI según el rol del usuario.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { getSchedules, markScheduleAsComplete, createSchedule, type ApiSchedule } from '@/api/scheduleService';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Check, Calendar } from 'lucide-react';
import { NewScheduleForm } from './components/NewScheduleForm';

type ScheduleCreationData = {
    teacherId: string;
    subjectId: string;
    groupId: string;
    fecha: Date;
    hora_inicio: string;
    hora_fin: string;
    modalidad: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDA';
    aula?: string;
};

export const ScheduleManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const canManage = user && ['ADMIN', 'SUPERADMIN', 'COORDINADOR', 'ASISTENTE'].includes(user.role);

  const { data: allSchedules, isLoading, isError, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedules,
  });

  // --- CORRECCIÓN CLAVE 1: VALOR POR DEFECTO ---
  // Usamos el operador '??' para asegurar que 'displayedSchedules' sea siempre un array,
  // nunca 'undefined'. Esto resuelve los errores de "posiblemente undefined".
  const displayedSchedules = (canManage
    ? allSchedules
    : allSchedules?.filter(schedule => schedule.teacher.fullName === user?.fullName)
  ) ?? [];

  const completionMutation = useMutation({
    mutationFn: markScheduleAsComplete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['schedules'] }); },
  });

  const createScheduleMutation = useMutation({
    mutationFn: (data: ScheduleCreationData) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsCreateDialogOpen(false);
    },
    onError: (err: any) => {
      alert(`Error al crear el cronograma: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleCreateSubmit = (data: any) => {
    // AHORA USAMOS LOS DATOS REALES DEL FORMULARIO
    const dataToSend = {
      teacherId: data.teacherId,
      subjectId: data.subjectId, // <-- Corregido
      groupId: data.groupId,     // <-- Corregido
      fecha: new Date(data.fecha),
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      modalidad: data.modalidad,
      aula: data.aula,
    };
    createScheduleMutation.mutate(dataToSend as any);
  };

  const isToday = (dateString: string) => new Date(dateString).toDateString() === new Date().toDateString();

  if (isLoading) return <div className="text-center p-8">Cargando cronogramas...</div>;
  if (isError) return <div className="text-center p-8 text-destructive">Error al cargar datos: {error instanceof Error ? error.message : 'Error desconocido'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {canManage ? 'Gestión de Cronogramas' : 'Mi Cronograma'}
        </h2>
        {canManage && <Button onClick={() => setIsCreateDialogOpen(true)}>Crear Cronograma</Button>}
      </div>

      {canManage ? (
        <Card>
          <CardContent className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Asignatura</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* --- CORRECCIÓN CLAVE 2: TIPADO EXPLÍCITO --- */}
                {displayedSchedules.map((schedule: ApiSchedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{format(new Date(schedule.fecha), 'P', { locale: es })}</TableCell>
                    <TableCell>{schedule.subject.name}</TableCell>
                    <TableCell>{schedule.teacher.fullName}</TableCell>
                    <TableCell><Badge variant={schedule.cumplido ? 'default' : 'secondary'}>{schedule.estado}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedSchedules.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No tienes jornadas programadas.</CardContent></Card>
          ) : (
            // --- CORRECCIÓN CLAVE 2: TIPADO EXPLÍCITO ---
            displayedSchedules.map((schedule: ApiSchedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* ... resto del JSX de la tarjeta del docente ... */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{schedule.subject.name}</h3>
                      <Badge variant={schedule.modalidad === 'PRESENCIAL' ? 'default' : 'secondary'}>{schedule.modalidad}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Grupo: {schedule.group.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar size={14}/> {format(new Date(schedule.fecha), 'PPP', { locale: es })}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14}/> {schedule.hora_inicio} - {schedule.hora_fin}</span>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col items-end gap-2">
                    {schedule.cumplido ? (
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50"><Check size={14} className="mr-1"/> Cumplida</Badge>
                        {schedule.fecha_cumplimiento && <p className="text-xs text-muted-foreground mt-1">{format(new Date(schedule.fecha_cumplimiento), "dd/MM/yyyy, HH:mm", { locale: es })}</p>}
                      </div>
                    ) : (
                      <Button onClick={() => completionMutation.mutate(schedule.id)} disabled={!isToday(schedule.fecha) || completionMutation.isPending} className="bg-green-600 hover:bg-green-700 w-full md:w-auto"><Check size={16} className="mr-2"/>{completionMutation.isPending ? 'Marcando...' : 'Marcar Cumplimiento'}</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Crear Nuevo Cronograma</DialogTitle></DialogHeader>
          <NewScheduleForm onSubmit={handleCreateSubmit} onCancel={() => setIsCreateDialogOpen(false)} isSubmitting={createScheduleMutation.isPending}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};