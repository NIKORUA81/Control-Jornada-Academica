import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/userService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserForm, type UserFormData } from './UserForm';
import { useDialogStore } from '@/stores/dialogStore';

export const UserEditDialog = () => {
  const queryClient = useQueryClient();
  const { isUserEditDialogOpen, editingUser, closeAllDialogs } = useDialogStore();

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserFormData }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeAllDialogs();
    },
    onError: (err: any) => alert(`Error: ${err.response?.data?.message || err.message}`),
  });

  const handleFormSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUserMutation.mutate({ userId: editingUser.id, data });
    }
  };

  if (!editingUser) return null;

  return (
    <Dialog open={isUserEditDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent 
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Usuario: {editingUser.fullName}</DialogTitle>
        </DialogHeader>
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={closeAllDialogs}
          isSubmitting={updateUserMutation.isPending}
          defaultValues={{
            fullName: editingUser.fullName,
            role: editingUser.role as any,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};