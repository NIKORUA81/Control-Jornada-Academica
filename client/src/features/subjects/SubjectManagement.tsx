import { useQuery } from '@tanstack/react-query';
import { getSubjects, type ApiSubject } from '@/api/subjectService';
import { useDialogStore } from '@/stores/dialogStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SubjectManagement = () => {
  const { data: subjects, isLoading } = useQuery<ApiSubject[]>({ queryKey: ['subjects'], queryFn: getSubjects });
  const openCreateDialog = useDialogStore((state) => state.openSubjectCreateDialog);

  if (isLoading) return <div>Cargando materias...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Materias</h1>
        <Button onClick={openCreateDialog}>Crear Materia</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Materias</CardTitle>
          <CardDescription>Un total de {subjects?.length ?? 0} materias activas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nombre</TableHead><TableHead>Créditos</TableHead></TableRow></TableHeader>
            <TableBody>
              {subjects?.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};