import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubject } from '@/api/subjectService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useDialogStore } from '@/stores/dialogStore';
import { SubjectForm } from './SubjectForm';

export const SubjectCreateDialog = () => {
  const queryClient = useQueryClient();
  const { isSubjectCreateDialogOpen, closeAllDialogs } = useDialogStore();

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      closeAllDialogs();
    },
    onError: (err: any) => alert(`Error: ${err.response?.data?.message || err.message}`),
  });

  return (
    // onOpenChange se encarga de cerrar el diálogo si se hace clic fuera
    <Dialog open={isSubjectCreateDialogOpen} onOpenChange={closeAllDialogs}>
      <DialogContent 
        onInteractOutside={(e) => {
          // Esta línea es crucial: previene que el diálogo se cierre
          // cuando se interactúa con otros portales (como los Selects).
          e.preventDefault();
        }}
      >
        <DialogHeader><DialogTitle>Crear Nueva Materia</DialogTitle></DialogHeader>
        <SubjectForm 
          onSubmit={createMutation.mutate} 
          onCancel={closeAllDialogs} 
          isSubmitting={createMutation.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};