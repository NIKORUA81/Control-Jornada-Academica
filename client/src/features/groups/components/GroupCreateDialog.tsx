/**
 * @file GroupCreateDialog.tsx
 * Componente que renderiza el diálogo (modal) para la creación de un nuevo grupo.
 * Este componente es "global" y se controla a través del store de Zustand.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroup } from '@/api/groupService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useDialogStore } from '@/stores/dialogStore';
import { GroupForm } from './GroupForm';

export const GroupCreateDialog = () => {
  const queryClient = useQueryClient();
  const { isGroupCreateDialogOpen, closeAllDialogs } = useDialogStore();

  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      closeAllDialogs();
    },
    onError: (err: any) => alert(`Error: ${err.response?.data?.message || err.message}`),
  });

  return (
    <Dialog open={isGroupCreateDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent 
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader><DialogTitle>Crear Nuevo Grupo</DialogTitle></DialogHeader>
        <GroupForm 
          onSubmit={createMutation.mutate} 
          onCancel={closeAllDialogs} 
          isSubmitting={createMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};