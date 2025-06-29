// client/src/features/userManagement/components/UserCreateDialog.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserCreateForm } from './UserCreateForm'; // CAMBIO: Usar UserCreateForm
import { type CreateUserFormData } from './userSchemas'; // Solo el tipo es necesario aquí
import { useDialogStore } from '@/stores/dialogStore';
import { createUser, type CreateUserPayload } from '@/api/userService'; // Importar CreateUserPayload

export const UserCreateDialog = () => {
  const queryClient = useQueryClient();
  const { isUserCreateDialogOpen, closeAllDialogs } = useDialogStore();

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserPayload) => createUser(data), // Usar CreateUserPayload
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
          El 'onSubmit' que se pasa aquí ya espera CreateUserFormData.
        */}
        <UserCreateForm // CAMBIO: Usar UserCreateForm
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={createUserMutation.isPending}
          // defaultValues se pueden omitir si el formulario maneja sus propios defaults, o pasarlos explícitamente
          // defaultValues={{ email: '', username: '', fullName: '', password: '', confirmPassword: '', role: UserRole.DOCENTE }}
        />
      </DialogContent>
    </Dialog>
  );
};
