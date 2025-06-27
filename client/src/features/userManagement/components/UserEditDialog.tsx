import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, type ApiUser } from '@/api/userService'; // ApiUser ya se importa aquí
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserForm } from './UserForm';
import { updateUserSchema, type UpdateUserFormData } from './userSchemas'; // Importar esquema y tipo
import { useDialogStore } from '@/stores/dialogStore';

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
        <UserForm
          mode="edit" // Especificar el modo
          schema={updateUserSchema} // Pasar el esquema de actualización
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={updateUserMutation.isPending}
          defaultValues={{ // Asegurar que estos valores coincidan con UpdateUserFormData
            fullName: editingUser.fullName,
            role: editingUser.role, // El tipo de role en ApiUser debería ser compatible
            // Si updateUserSchema incluyera email/username (opcionales), se podrían añadir:
            // email: editingUser.email,
            // username: editingUser.username,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};