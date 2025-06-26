import { create } from 'zustand';
import type { ApiUser } from '@/api/userService'; // Renamed User to ApiUser to match file

interface DialogStoreState {
  isUserEditDialogOpen: boolean;
  editingUser: ApiUser | null;
  openUserEditDialog: (user: ApiUser) => void;

  isUserCreateDialogOpen: boolean; // NUEVO para el diálogo de creación de usuarios
  openUserCreateDialog: () => void; // NUEVO

  isSubjectCreateDialogOpen: boolean;
  openSubjectCreateDialog: () => void;

  isGroupCreateDialogOpen: boolean;
  openGroupCreateDialog: () => void;

  closeAllDialogs: () => void;
}

export const useDialogStore = create<DialogStoreState>((set) => ({
  isUserEditDialogOpen: false,
  editingUser: null,
  isUserCreateDialogOpen: false, // Estado inicial
  isSubjectCreateDialogOpen: false,
  isGroupCreateDialogOpen: false,

  openUserEditDialog: (user) => set(state => ({
    ...state, // Mantener otros estados
    isUserEditDialogOpen: true,
    editingUser: user,
    isUserCreateDialogOpen: false, // Asegurar que otros diálogos de gestión de usuarios estén cerrados
    isSubjectCreateDialogOpen: false, // Ejemplo de cerrar otros dialogos no relacionados si fuera necesario
    isGroupCreateDialogOpen: false,
  })),

  openUserCreateDialog: () => set(state => ({
    ...state, // Mantener otros estados
    isUserCreateDialogOpen: true,
    isUserEditDialogOpen: false,
    editingUser: null,
    isSubjectCreateDialogOpen: false,
    isGroupCreateDialogOpen: false,
  })),

  openSubjectCreateDialog: () => set(state => ({
    ...state,
    isSubjectCreateDialogOpen: true,
    // Cerrar otros si es necesario
    isUserEditDialogOpen: false,
    editingUser: null,
    isUserCreateDialogOpen: false,
    isGroupCreateDialogOpen: false,
  })),

  openGroupCreateDialog: () => set(state => ({
    ...state,
    isGroupCreateDialogOpen: true,
    // Cerrar otros si es necesario
    isUserEditDialogOpen: false,
    editingUser: null,
    isUserCreateDialogOpen: false,
    isSubjectCreateDialogOpen: false,
  })),
  
  closeAllDialogs: () => set({
    isUserEditDialogOpen: false,
    editingUser: null,
    isUserCreateDialogOpen: false,
    isSubjectCreateDialogOpen: false,
    isGroupCreateDialogOpen: false,
    // ... y cualquier otro estado de diálogo que se añada en el futuro
  }),
}));