import { create } from 'zustand';
import type { ApiUser } from '@/api/userService';

interface DialogStoreState {
  isUserEditDialogOpen: boolean;
  editingUser: ApiUser | null;
  openUserEditDialog: (user: ApiUser) => void;

  isSubjectCreateDialogOpen: boolean;
  openSubjectCreateDialog: () => void;

  isGroupCreateDialogOpen: boolean;
  openGroupCreateDialog: () => void;

  closeAllDialogs: () => void;
}

export const useDialogStore = create<DialogStoreState>((set) => ({
  isUserEditDialogOpen: false,
  editingUser: null,
  isSubjectCreateDialogOpen: false,
  isGroupCreateDialogOpen: false,

  openUserEditDialog: (user) => set({ isUserEditDialogOpen: true, editingUser: user }),
  openSubjectCreateDialog: () => set({ isSubjectCreateDialogOpen: true }),
  openGroupCreateDialog: () => set({ isGroupCreateDialogOpen: true }),
  
  closeAllDialogs: () => set({
    isUserEditDialogOpen: false,
    editingUser: null,
    isSubjectCreateDialogOpen: false,
    isGroupCreateDialogOpen: false,
  }),
}));