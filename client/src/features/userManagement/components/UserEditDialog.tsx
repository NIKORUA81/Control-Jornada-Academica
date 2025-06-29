// client/src/features/userManagement/components/UserEditDialog.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/userService'; // ApiUser se importa desde userService si es necesario, pero no se usa directamente aquí.
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserForm } from './UserForm';
import { updateUserSchema, type UpdateUserFormData } from './userSchemas'; // Importar esquema y tipo
import { useDialogStore } from '@/stores/dialogStore';

export const UserEditDialog = () => {
  const queryClient = useQueryClient();
  const { isUserEditDialogOpen, editingUser, closeAllDialogs } = useDialogStore();

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserFormData }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeAllDialogs();
    },
    onError: (err: any) => { // Considerar tipar 'err' mejor si se conoce la estructura del error
      alert(`Error al actualizar usuario: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleFormSubmit = (data: UpdateUserFormData) => {
    if (editingUser) {
      updateUserMutation.mutate({ userId: editingUser.id, data });
    }
  };

  if (!editingUser || !isUserEditDialogOpen) return null;

  return (
    <Dialog open={isUserEditDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent 
        onInteractOutside={(e) => {
          if (updateUserMutation.isPending) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Usuario: {editingUser.fullName}</DialogTitle>
          <DialogDescription>
            Modifique los detalles del usuario. El correo y nombre de usuario no son editables aquí.
          </DialogDescription>
        </DialogHeader>
        <UserEditForm // Correcto: Usar UserEditForm
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={updateUserMutation.isPending}
          defaultValues={{
            fullName: editingUser.fullName,
            role: editingUser.role,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};