import { useQuery } from '@tanstack/react-query';
import { getUsers, type ApiUser } from '@/api/userService';
import { useDialogStore } from '@/stores/dialogStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCreateDialog } from './components/UserCreateDialog'; // Importar el nuevo diálogo
import { UserEditDialog } from './components/UserEditDialog'; // Asegurarse que UserEditDialog también se importa si no está en un layout global

export const UserManagement = () => {
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const openUserEditDialog = useDialogStore((state) => state.openUserEditDialog);
  const openUserCreateDialog = useDialogStore((state) => state.openUserCreateDialog); // Obtener la acción para abrir el diálogo de creación

  if (isLoading) return <div className="p-4">Cargando usuarios...</div>;
  // Considerar un mejor estado de carga, quizás un Skeleton

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Usuarios ({users?.length ?? 0})</CardTitle>
          <Button onClick={openUserCreateDialog}>Crear Usuario</Button>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user: ApiUser) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openUserEditDialog(user)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay usuarios registrados.</p>
              <Button onClick={openUserCreateDialog} className="mt-4">Crear Primer Usuario</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Los diálogos se pueden renderizar aquí o en un componente de layout superior
          si se usan desde múltiples lugares y se quiere asegurar que solo haya una instancia.
          Por ahora, los pongo aquí para que estén autocontenidos con la feature. */}
      <UserCreateDialog />
      <UserEditDialog />
    </>
  );
};