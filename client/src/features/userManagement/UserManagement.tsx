import { useQuery } from '@tanstack/react-query';
import { getUsers, type ApiUser } from '@/api/userService';
import { useDialogStore } from '@/stores/dialogStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


export const UserManagement = () => {
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const openUserEditDialog = useDialogStore((state) => state.openUserEditDialog);

  if (isLoading) return <div>Cargando usuarios...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Usuarios ({users?.length ?? 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {/* --- CÓDIGO AÑADIDO --- */}
            {/* Se completa la cabecera de la tabla */}
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Se usa optional chaining (users?) por si los datos aún no han llegado */}
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
                  {/* Al hacer clic, se llama a la acción del store global,
                      pasando el objeto de usuario completo. */}
                  <Button variant="ghost" size="sm" onClick={() => openUserEditDialog(user)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};