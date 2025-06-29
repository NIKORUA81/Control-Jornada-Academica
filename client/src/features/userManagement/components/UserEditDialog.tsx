import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, type ApiUser } from '@/api/userService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserEditForm } from './UserEditForm'; // CAMBIO: Usar UserEditForm
import { type UpdateUserFormData } from './userSchemas'; // Solo el tipo es necesario
import { useDialogStore } from '@/stores/dialogStore';
// updateUserSchema se importa y usa dentro de UserEditForm

export const UserEditDialog = () => {
  const queryClient = useQueryClient();
  const { isUserEditDialogOpen, editingUser, closeAllDialogs } = useDialogStore();

  const updateUserMutation = useMutation({
    // Asegurarse que el tipo de 'data' aquí coincide con lo que espera 'updateUser'
    // y lo que 'UserForm' con 'updateUserSchema' proveerá.
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserFormData }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeAllDialogs();
      // Considerar añadir un toast de éxito aquí
    },
    onError: (err: any) => {
      // Considerar un toast de error
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
        <UserEditForm // CAMBIO: Usar UserEditForm
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={updateUserMutation.isPending}
          defaultValues={{
            fullName: editingUser.fullName,
            role: editingUser.role,
            // Si UserEditForm manejara isActive, se pasaría aquí:
            // isActive: editingUser.isActive,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};