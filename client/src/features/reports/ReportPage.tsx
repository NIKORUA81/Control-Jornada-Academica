// client/src/features/reports/ReportPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modality, ScheduleStatus, UserRole } from '@/types/enums'; // CAMBIO DE IMPORTACIÓN 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Importar servicios API
import { getUsers, type ApiUser } from '@/api/userService';
import { getSubjects, type Subject } from '@/api/subjectService'; 
import { getGroups, type Group } from '@/api/groupService'; 
import { getFilteredSchedules, type ApiSchedule, type ScheduleFilters } from '@/api/scheduleService';

// Valores iniciales para los filtros
const initialFilters = {
  teacherId: 'all',
  month: 'all', // 1-12 o 'all'
  year: new Date().getFullYear().toString(), // Año actual por defecto
  subjectId: 'all',
  groupId: 'all',
  status: 'all', // 'PROGRAMADO', 'COMPLETADO', 'CANCELADO', o 'all'
  modality: 'all', // 'PRESENCIAL', 'VIRTUAL', 'HIBRIDA', o 'all'
};

export const ReportPage: React.FC = () => {
  const [filters, setFilters] = useState<ScheduleFilters>(initialFilters);
  const [reportData, setReportData] = useState<ApiSchedule[]>([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // Estado para el botón de exportar

  const queryClient = useQueryClient();

  // Obtener datos para los dropdowns de los filtros
  const { data: usersData, isLoading: isLoadingUsers } = useQuery<ApiUser[]>({ 
    queryKey: ['usersForReportFilters'], // Clave diferente para no interferir con otras listas de usuarios
    queryFn: getUsers 
  });
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery<Subject[]>({ 
    queryKey: ['subjectsForReportFilters'], 
    queryFn: getSubjects 
  });
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery<Group[]>({ 
    queryKey: ['groupsForReportFilters'], 
    queryFn: getGroups 
  });

  // Query para obtener los datos del reporte. Se ejecutará manualmente.
  const { 
    data: fetchedReportData, 
    isLoading: isLoadingReport, 
    isError: isErrorReport,
    error: reportError,
    refetch: fetchReportData, // Función para re-ejecutar la query
  } = useQuery<ApiSchedule[], Error>({
    queryKey: ['filteredSchedulesReport', filters], // Incluir filtros en la queryKey para que cambie si los filtros cambian
    queryFn: () => getFilteredSchedules(filters),
    enabled: false, // Deshabilitada por defecto, se llama con refetch()
    onSuccess: (data) => {
      setReportData(data);
      setIsReportGenerated(true);
      console.log("Datos del reporte recibidos:", data);
    },
    onError: (err) => {
      setReportData([]); // Limpiar datos anteriores en caso de error
      setIsReportGenerated(true); // Se intentó generar
      console.error("Error al obtener datos del reporte:", err);
      // Aquí se podría mostrar un toast o mensaje de error al usuario
    }
  });

  // Memoizar listas para los selects
  const teachers = useMemo(() => {
    return usersData?.filter(user => user.role === UserRole.DOCENTE) || [];
  }, [usersData]);

  const subjects = useMemo(() => subjectsData || [], [subjectsData]);
  const groups = useMemo(() => groupsData || [], [groupsData]);


  const months = [
    { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
  ];

  // Generar años (ej. últimos 5 años y próximos 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => (currentYear - 5 + i).toString()).reverse();


  const handleFilterChange = (filterName: keyof ScheduleFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setIsReportGenerated(false); // Resetear estado de reporte generado si cambian los filtros
  };

  const handleApplyFilters = () => {
    // `fetchReportData` es la función devuelta por `useQuery` para re-ejecutar la query.
    // Los filtros actuales ya están en el estado `filters` y son parte de la `queryKey`.
    // Si la queryKey cambia (porque los filtros cambian) y la query está habilitada, se re-ejecutaría.
    // Pero como está `enabled: false`, necesitamos `refetch`.
    fetchReportData(); 
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setReportData([]);
    setIsReportGenerated(false);
    // Opcionalmente, se podría querer limpiar los resultados de la query en react-query cache
    // queryClient.removeQueries({ queryKey: ['filteredSchedulesReport'] });
  };

  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      // Idealmente, este botón estaría deshabilitado, pero como doble check:
      alert("No hay datos para exportar."); 
      return;
    }
    setIsExporting(true);

    try {
      const dataForExcel = reportData.map(schedule => ({
        'Fecha': new Date(schedule.fecha).toLocaleDateString(),
        'Hora Inicio': formatMinutesToHHMM(schedule.hora_inicio),
        'Hora Fin': formatMinutesToHHMM(schedule.hora_fin),
        'Docente': schedule.teacher.fullName,
        'Asignatura': schedule.subject.name,
        'Código Asignatura': schedule.subject.code,
        'Grupo': schedule.group.name,
        'Modalidad': schedule.modalidad,
        'Aula': schedule.aula || '-',
        'Estado': schedule.estado.replace('_', ' '),
        'Cumplido': schedule.cumplido ? 'Sí' : 'No',
        'Fecha Cumplimiento': schedule.fecha_cumplimiento ? new Date(schedule.fecha_cumplimiento).toLocaleString() : '-',
        'Observaciones': schedule.observaciones || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
      
      // Ajustar anchos de columnas (opcional, pero mejora la legibilidad)
      const columnKeys = Object.keys(dataForExcel[0] || {});
      const columnWidths = columnKeys.map(key => {
        const maxLength = Math.max(
          key.length, 
          ...dataForExcel.map(row => String(row[key as keyof typeof row]).length)
        );
        return { wch: maxLength + 2 }; // +2 para un pequeño padding
      });
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ReporteHorarios');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
      
      const today = new Date();
      const fileName = `ReporteHorarios_${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}.xlsx`;
      saveAs(dataBlob, fileName);

    } catch (exportError) {
      console.error("Error al exportar a Excel:", exportError);
      alert("Ocurrió un error al generar el archivo Excel. Revise la consola para más detalles.");
    } finally {
      setIsExporting(false);
    }
  };
  
  // Mensaje para la sección de resultados
  let resultsMessage = "Los datos del reporte se mostrarán aquí después de aplicar los filtros.";
  if (isLoadingReport) {
    resultsMessage = "Generando reporte...";
  } else if (isReportGenerated) {
    if (isErrorReport) {
      resultsMessage = `Error al generar el reporte: ${reportError?.message || 'Error desconocido'}`;
    } else if (reportData.length === 0) {
      resultsMessage = "No se encontraron datos para los filtros seleccionados.";
    }
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Generación de Reportes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros del Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Filtro Docente */}
            <div>
              <Label htmlFor="teacher-filter">Docente</Label>
              <Select 
                id="teacher-filter" 
                value={filters.teacherId} 
                onValueChange={(value) => handleFilterChange('teacherId', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar docente" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Docentes</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Mes */}
            <div>
              <Label htmlFor="month-filter">Mes</Label>
              <Select 
                id="month-filter" 
                value={filters.month}
                onValueChange={(value) => handleFilterChange('month', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar mes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Meses</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Año */}
            <div>
              <Label htmlFor="year-filter">Año</Label>
              <Select
                id="year-filter"
                value={filters.year}
                onValueChange={(value) => handleFilterChange('year', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar año" /></SelectTrigger>
                <SelectContent>
                   {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro Asignatura */}
            <div>
              <Label htmlFor="subject-filter">Asignatura</Label>
              <Select
                id="subject-filter"
                value={filters.subjectId}
                onValueChange={(value) => handleFilterChange('subjectId', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar asignatura" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Asignaturas</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Grupo */}
            <div>
              <Label htmlFor="group-filter">Grupo</Label>
              <Select
                id="group-filter"
                value={filters.groupId}
                onValueChange={(value) => handleFilterChange('groupId', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar grupo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Grupos</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Estado del Horario */}
            <div>
              <Label htmlFor="status-filter">Estado del Horario</Label>
              <Select
                id="status-filter"
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  {Object.values(ScheduleStatus).map(status => (
                    <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Modalidad */}
            <div>
              <Label htmlFor="modality-filter">Modalidad</Label>
              <Select
                id="modality-filter"
                value={filters.modality}
                onValueChange={(value) => handleFilterChange('modality', value)}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar modalidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Modalidades</SelectItem>
                   {Object.values(Modality).map(modality => (
                    <SelectItem key={modality} value={modality}>{modality.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClearFilters} disabled={isLoadingReport}>Limpiar Filtros</Button>
          <Button onClick={handleApplyFilters} disabled={isLoadingReport}>
            {isLoadingReport ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resultados del Reporte</CardTitle>
          <Button 
            onClick={handleExportToExcel} 
            disabled={isLoadingReport || reportData.length === 0 || isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar a Excel'}
          </Button> 
        </CardHeader>
        <CardContent>
          {isLoadingReport && <p>Cargando resultados...</p>}
          {!isLoadingReport && reportData.length === 0 && (
            <p className="text-gray-500">{resultsMessage}</p>
          )}
          {/* Aquí irá la tabla con los resultados del reporte si reportData.length > 0 */}
          {/* Por ahora, solo un placeholder: */}
          {!isLoadingReport && reportData.length > 0 && (
            <div>
              <p>Se encontraron {reportData.length} registros.</p>
              {/* La tabla se implementará en el siguiente paso */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fin</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Cumplido</TableHead>
                    {/* <TableHead>Observaciones</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{new Date(schedule.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>{formatMinutesToHHMM(schedule.hora_inicio)}</TableCell>
                      <TableCell>{formatMinutesToHHMM(schedule.hora_fin)}</TableCell>
                      <TableCell>{schedule.teacher.fullName}</TableCell>
                      <TableCell>{schedule.subject.name} ({schedule.subject.code})</TableCell>
                      <TableCell>{schedule.group.name}</TableCell>
                      <TableCell><Badge variant="outline">{schedule.modalidad}</Badge></TableCell>
                      <TableCell>{schedule.aula || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            schedule.estado === ScheduleStatus.COMPLETADO ? 'success' :
                            schedule.estado === ScheduleStatus.CANCELADO ? 'destructive' :
                            schedule.estado === ScheduleStatus.EN_CURSO ? 'default' : // Podría ser 'info' o 'warning'
                            'secondary' // PROGRAMADO
                          }
                        >
                          {schedule.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{schedule.cumplido ? 'Sí' : 'No'}</TableCell>
                      {/* <TableCell>{schedule.observaciones || '-'}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Función de utilidad para formatear minutos a HH:MM
const formatMinutesToHHMM = (totalMinutes: number | undefined | null): string => {
  if (totalMinutes == null || totalMinutes < 0 || totalMinutes > 1439) {
    // Podríamos retornar '-' o 'N/A' o incluso string vacío si se prefiere
    return '--:--'; 
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  return `${paddedHours}:${paddedMinutes}`;
};

export default ReportPage;
