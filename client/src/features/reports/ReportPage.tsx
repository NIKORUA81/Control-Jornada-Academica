// client/src/features/reports/ReportPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modality, ScheduleStatus, UserRole } from '@/types/enums';
import ExcelJS from 'exceljs'; // CAMBIO: Importar ExcelJS
import { saveAs } from 'file-saver'; 

// Importar servicios API
import { getUsers, type ApiUser } from '@/api/userService';
import { getSubjects, type ApiSubject } from '@/api/subjectService'; 
import { getGroups, type ApiGroup } from '@/api/groupService';     
import { getFilteredSchedules, type ApiSchedule, type ScheduleFilters } from '@/api/scheduleService';

const initialFilters: ScheduleFilters = {
  teacherId: 'all',
  month: 'all',
  year: new Date().getFullYear().toString(),
  subjectId: 'all',
  groupId: 'all',
  status: 'all',
  modality: 'all',
};

export const ReportPage: React.FC = () => {
  const [filters, setFilters] = useState<ScheduleFilters>(initialFilters);
  const [reportData, setReportData] = useState<ApiSchedule[]>([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 

  const { data: usersData, isLoading: isLoadingUsersQuery } = useQuery<ApiUser[]>({ 
    queryKey: ['usersForReportFilters'], 
    queryFn: getUsers 
  });
  const { data: subjectsData, isLoading: isLoadingSubjectsQuery } = useQuery<ApiSubject[]>({ 
    queryKey: ['subjectsForReportFilters'], 
    queryFn: getSubjects 
  });
  const { data: groupsData, isLoading: isLoadingGroupsQuery } = useQuery<ApiGroup[]>({ 
    queryKey: ['groupsForReportFilters'], 
    queryFn: getGroups 
  });

  const { 
    data: queryResultData, 
    isLoading: isLoadingReport, 
    isError: isErrorReport,
    error: reportError,
    refetch: fetchReportData,
  } = useQuery<ApiSchedule[], Error>({ 
    queryKey: ['filteredSchedulesReport', filters], 
    queryFn: async () => {
      console.log('[QUERY_FN] Ejecutando getFilteredSchedules con filtros:', filters);
      try {
        const data = await getFilteredSchedules(filters);
        console.log('[QUERY_FN] Datos recibidos de getFilteredSchedules:', data);
        return data;
      } catch (error) {
        console.error('[QUERY_FN] Error en getFilteredSchedules:', error);
        throw error; 
      }
    },
    enabled: false,
  });

  useEffect(() => {
    console.log('[DEBUG_QUERY_STATE]', { isLoadingReport, isErrorReport, reportError, queryResultData, isReportGenerated, reportDataLength: reportData.length });
  }, [isLoadingReport, isErrorReport, reportError, queryResultData, isReportGenerated, reportData]);

  const teachers = useMemo(() => usersData?.filter(user => user.role === UserRole.DOCENTE) || [], [usersData]);
  const subjects: ApiSubject[] = useMemo(() => subjectsData || [], [subjectsData]);
  const groups: ApiGroup[] = useMemo(() => groupsData || [], [groupsData]);

  const months = [
    { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => (currentYear - 5 + i).toString()).reverse();

  const handleFilterChange = (filterName: keyof ScheduleFilters, value: string) => {
    console.log(`[FILTER_CHANGE] ${filterName}: ${value}`);
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setIsReportGenerated(false); 
    setReportData([]); 
  };

  const handleApplyFilters = async () => {
    console.log('[APPLY_FILTERS] Iniciando aplicación de filtros...', filters);
    setIsReportGenerated(false); 
    setReportData([]);           

    try {
      console.log('[APPLY_FILTERS] Llamando a fetchReportData...');
      const result = await fetchReportData(); 
      console.log('[APPLY_FILTERS] Resultado de fetchReportData:', result);

      if (result.isSuccess && result.data) {
        console.log('[APPLY_FILTERS] Éxito. Datos:', result.data);
        setReportData(result.data);
      } else if (result.isError && result.error) {
        console.error('[APPLY_FILTERS] Error en fetchReportData:', result.error);
      }
    } catch (e) {
      console.error('[APPLY_FILTERS] Excepción no controlada al llamar a fetchReportData:', e);
    } finally {
      setIsReportGenerated(true); 
      console.log('[APPLY_FILTERS] Proceso de aplicación de filtros finalizado.');
    }
  };

  const handleClearFilters = () => {
    console.log('[CLEAR_FILTERS] Limpiando filtros.');
    setFilters(initialFilters);
    setReportData([]);
    setIsReportGenerated(false);
  };
  
  const handleExportToExcel = () => {
    if (reportData.length === 0) {
      alert("No hay datos para exportar."); 
      return;
    }
    setIsExporting(true);
    console.log('[EXPORT_EXCEL] Iniciando exportación con ExcelJS...');

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'SistemaCJA';
      workbook.lastModifiedBy = 'SistemaCJA';
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet('Reporte Horarios');

      worksheet.columns = [
        { header: 'Fecha', key: 'fecha_str', width: 15, style: { numFmt: 'dd/mm/yyyy' } },
        { header: 'Hora Inicio', key: 'hora_inicio_str', width: 15 },
        { header: 'Hora Fin', key: 'hora_fin_str', width: 15 },
        { header: 'Docente', key: 'docente', width: 30 },
        { header: 'Asignatura', key: 'asignatura', width: 35 },
        { header: 'Cód. Asignatura', key: 'codigo_asignatura', width: 18 },
        { header: 'Grupo', key: 'grupo', width: 25 },
        { header: 'Modalidad', key: 'modalidad', width: 15 },
        { header: 'Aula', key: 'aula', width: 15 },
        { header: 'Estado', key: 'estado', width: 18 },
        { header: 'Cumplido', key: 'cumplido_str', width: 12 },
        { header: 'Fecha Cumplimiento', key: 'fecha_cumplimiento_str', width: 25 },
        { header: 'Observaciones', key: 'observaciones', width: 40 },
      ];

      // Estilo para la cabecera
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0078D4' }, // Azul
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Aplicar borde a las celdas de cabecera
      worksheet.getRow(1).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });


      const dataForExcel = reportData.map(schedule => ({
        fecha_str: new Date(schedule.fecha), // Pasar el objeto Date para que ExcelJS lo formatee
        hora_inicio_str: formatMinutesToHHMM(schedule.hora_inicio),
        hora_fin_str: formatMinutesToHHMM(schedule.hora_fin),
        docente: schedule.teacher.fullName,
        asignatura: schedule.subject.name,
        codigo_asignatura: schedule.subject.code,
        grupo: schedule.group.name,
        modalidad: schedule.modalidad,
        aula: schedule.aula || '-',
        estado: schedule.estado.replace('_', ' '),
        cumplido_str: schedule.cumplido ? 'Sí' : 'No',
        fecha_cumplimiento_str: schedule.fecha_cumplimiento ? new Date(schedule.fecha_cumplimiento).toLocaleString() : '-',
        observaciones: schedule.observaciones || '-',
      }));

      worksheet.addRows(dataForExcel);

      // Aplicar bordes a todas las celdas de datos
      worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
        if (rowNumber > 1) { // Omitir la cabecera que ya tiene estilo
          row.eachCell({ includeEmpty: true }, function(cell) {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        }
      });
      
      const buffer = await workbook.xlsx.writeBuffer();
      const dataBlob = new Blob([buffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" 
      });
      
      const today = new Date();
      const fileName = `ReporteHorarios_${today.getFullYear()}${String(today.getMonth()+1).padStart(2,'0')}${String(today.getDate()).padStart(2,'0')}.xlsx`;
      saveAs(dataBlob, fileName);
      console.log('[EXPORT_EXCEL] Exportación completada.');

    } catch (exportError) {
      console.error("Error al exportar a Excel con ExcelJS:", exportError);
      alert("Ocurrió un error al generar el archivo Excel. Revise la consola para más detalles.");
    } finally {
      setIsExporting(false);
    }
  };

  let resultsMessage = "Los datos del reporte se mostrarán aquí después de aplicar los filtros.";
  if (isLoadingReport) {
    resultsMessage = "Generando reporte...";
  } else if (isReportGenerated) {
    if (isErrorReport && reportError) { 
      resultsMessage = `Error al generar el reporte: ${reportError.message || 'Error desconocido'}`;
    } else if (reportData.length === 0) {
      resultsMessage = "No se encontraron datos para los filtros seleccionados.";
    }
  }

  const isLoadingInitialData = isLoadingUsersQuery || isLoadingSubjectsQuery || isLoadingGroupsQuery;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Generación de Reportes</h1>
      <Card>
        <CardHeader><CardTitle>Filtros del Reporte</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="teacher-filter">Docente</Label>
              <Select 
                value={filters.teacherId} 
                onValueChange={(value) => handleFilterChange('teacherId', value)}
                disabled={isLoadingUsersQuery || isLoadingReport}
              >
                <SelectTrigger id="teacher-filter"><SelectValue placeholder={isLoadingUsersQuery ? "Cargando..." : "Seleccionar docente"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Docentes</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="month-filter">Mes</Label>
              <Select 
                value={filters.month}
                onValueChange={(value) => handleFilterChange('month', value)}
                disabled={isLoadingReport}
              >
                <SelectTrigger id="month-filter"><SelectValue placeholder="Seleccionar mes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Meses</SelectItem>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year-filter">Año</Label>
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange('year', value)}
                disabled={isLoadingReport}
              >
                <SelectTrigger id="year-filter"><SelectValue placeholder="Seleccionar año" /></SelectTrigger>
                <SelectContent>
                   {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject-filter">Asignatura</Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) => handleFilterChange('subjectId', value)}
                disabled={isLoadingSubjectsQuery || isLoadingReport}
              >
                <SelectTrigger id="subject-filter"><SelectValue placeholder={isLoadingSubjectsQuery ? "Cargando..." : "Seleccionar asignatura"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Asignaturas</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="group-filter">Grupo</Label>
              <Select
                value={filters.groupId}
                onValueChange={(value) => handleFilterChange('groupId', value)}
                disabled={isLoadingGroupsQuery || isLoadingReport}
              >
                <SelectTrigger id="group-filter"><SelectValue placeholder={isLoadingGroupsQuery ? "Cargando..." : "Seleccionar grupo"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Grupos</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Estado del Horario</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
                disabled={isLoadingReport}
              >
                <SelectTrigger id="status-filter"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  {Object.values(ScheduleStatus).map((statusValue) => {
                    const typedStatus = statusValue as ScheduleStatus;
                    return (
                      <SelectItem key={typedStatus} value={typedStatus}>
                        {typedStatus.replace('_', ' ')}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="modality-filter">Modalidad</Label>
              <Select
                value={filters.modality}
                onValueChange={(value) => handleFilterChange('modality', value)}
                disabled={isLoadingReport}
              >
                <SelectTrigger id="modality-filter"><SelectValue placeholder="Seleccionar modalidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Modalidades</SelectItem>
                  {Object.values(Modality).map((modalityValue) => {
                    const typedModality = modalityValue as Modality;
                    return (
                      <SelectItem key={typedModality} value={typedModality}>
                        {typedModality.replace('_', ' ')}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClearFilters} disabled={isLoadingReport}>Limpiar Filtros</Button>
          <Button onClick={handleApplyFilters} disabled={isLoadingReport || isLoadingInitialData}>
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
          {!isLoadingReport && reportData.length > 0 && (
            <div>
              <p>Se encontraron {reportData.length} registros.</p>
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
                            schedule.estado === ScheduleStatus.COMPLETADO ? "default" : 
                            schedule.estado === ScheduleStatus.CANCELADO ? 'destructive' :
                            schedule.estado === ScheduleStatus.EN_CURSO ? 'outline' : 
                            'secondary' 
                          }
                        >
                          {schedule.estado.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{schedule.cumplido ? 'Sí' : 'No'}</TableCell>
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

const formatMinutesToHHMM = (totalMinutes: number | undefined | null): string => {
  if (totalMinutes == null || totalMinutes < 0 || totalMinutes > 1439) {
    return '--:--'; 
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  return `${paddedHours}:${paddedMinutes}`;
};

export default ReportPage;
