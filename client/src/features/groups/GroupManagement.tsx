import { useQuery } from '@tanstack/react-query';
import { getGroups, type ApiGroup } from '@/api/groupService';
import { useDialogStore } from '@/stores/dialogStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const GroupManagement = () => {
  const { data: groups, isLoading } = useQuery<ApiGroup[]>({ queryKey: ['groups'], queryFn: getGroups });
  const openCreateDialog = useDialogStore((state) => state.openGroupCreateDialog);

  if (isLoading) return <div>Cargando grupos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Grupos</h1>
        <Button onClick={openCreateDialog}>Crear Grupo</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Grupos</CardTitle>
          <CardDescription>Un total de {groups?.length ?? 0} grupos activos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nombre</TableHead></TableRow></TableHeader>
            <TableBody>
              {groups?.map((group) => (
                <TableRow key={group.id}><TableCell>{group.code}</TableCell><TableCell>{group.name}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};