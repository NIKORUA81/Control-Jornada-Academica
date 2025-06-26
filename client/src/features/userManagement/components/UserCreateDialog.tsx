// client/src/features/userManagement/components/UserCreateDialog.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserForm } from './UserForm'; // Asumimos que UserForm será adaptado
import { createUserSchema, type CreateUserFormData } from './userSchemas';
import { useDialogStore } from '@/stores/dialogStore';
import { createUser } from '@/api/userService'; // Necesitaremos crear esta función y el endpoint

export const UserCreateDialog = () => {
  const queryClient = useQueryClient();
  const { isUserCreateDialogOpen, closeAllDialogs } = useDialogStore();

  const createUserMutation = useMutation({
    // Especificamos el tipo de los datos de entrada para la mutación
    mutationFn: (data: Omit<CreateUserFormData, 'confirmPassword'>) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeAllDialogs();
      // Podríamos añadir un toast de éxito aquí, ej: toast.success("Usuario creado exitosamente");
    },
    onError: (err: any) => {
      // Idealmente, mostrar un toast de error o un mensaje más amigable
      // ej: toast.error(`Error al crear usuario: ${err.response?.data?.message || err.message}`);
      alert(`Error al crear usuario: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleFormSubmit = (data: CreateUserFormData) => {
    // Quitamos confirmPassword antes de enviar al backend
    const { confirmPassword, ...userData } = data;
    createUserMutation.mutate(userData);
  };

  // Asegurarse de que el diálogo solo se renderice o procese si está abierto
  if (!isUserCreateDialogOpen) {
    return null;
  }

  return (
    <Dialog open={isUserCreateDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent
        onInteractOutside={(e) => {
          // Prevenir cierre al hacer clic fuera si se está enviando
          if (createUserMutation.isPending) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete los campos para registrar un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>
        {/*
          UserForm necesitará ser adaptado para recibir 'mode', 'schema',
          y manejar los nuevos campos (email, username, password).
          El 'onSubmit' que se pasa aquí ya espera CreateUserFormData.
        */}
        <UserForm
          mode="create"
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={createUserMutation.isPending}
          schema={createUserSchema}
          defaultValues={{ email: '', username: '', fullName: '', password: '', confirmPassword: '', role: 'DOCENTE' }}
        />
      </DialogContent>
    </Dialog>
  );
};
