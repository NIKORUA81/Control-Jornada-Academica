import React from 'react'; // Necesario para React.lazy
import { Dashboard } from "@/features/dashboard/Dashboard";
import { ScheduleManagement } from "@/features/schedules/ScheduleManagement";
import { UserManagement } from "@/features/userManagement/UserManagement";
import { SubjectManagement } from "@/features/subjects/SubjectManagement";
import { GroupManagement } from "@/features/groups/GroupManagement";
import { Home, Calendar, Users, BookOpen, GraduationCap, FileText } from 'lucide-react'; // Añadido FileText

// Lazy load ReportPage
const ReportPage = React.lazy(() => import('@/features/reports/ReportPage'));

export type UserRole = 'DOCENTE' | 'COORDINADOR' | 'ASISTENTE' | 'ADMIN' | 'SUPERADMIN' | 'DIRECTOR';

export interface ViewConfig {
  id: string;
  label: string;
  component: React.ComponentType;
  allowedRoles: UserRole[];
  icon: React.ComponentType<{ className?: string }>;
}

export const viewConfig: ViewConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    component: Dashboard,
    allowedRoles: ['DOCENTE', 'COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN', 'DIRECTOR'],
    icon: Home,
  },
  {
    // ID único para la vista del docente
    id: 'my_schedule', 
    label: 'Mi Cronograma',
    component: ScheduleManagement,
    allowedRoles: ['DOCENTE'],
    icon: Calendar,
  },
  {
    // ID único para la vista de gestión
    id: 'schedule_management',
    label: 'Gestión de Cronogramas',
    component: ScheduleManagement,
    // --- CORRECCIÓN: Se añaden roles de gestión ---
    allowedRoles: ['COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN'],
    icon: Calendar,
  },
  {
    id: 'users',
    label: 'Gestión de Usuarios',
    component: UserManagement,
    // --- CORRECCIÓN: Se añade SUPERADMIN ---
    allowedRoles: ['ADMIN', 'SUPERADMIN'],
    icon: Users,
  },
  {
    id: 'subjects',
    label: 'Gestión de Materias',
    component: SubjectManagement,
    allowedRoles: ['COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN'],
    icon: BookOpen,
  },
  {
    id: 'groups',
    label: 'Gestión de Grupos',
    component: GroupManagement,
    allowedRoles: ['COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN'],
    icon: GraduationCap,
  },
  {
    id: 'reports',
    label: 'Reportes',
    component: ReportPage, // Usar el componente lazy-loaded
    allowedRoles: ['ADMIN', 'SUPERADMIN'], // Solo para Admin y Superadmin
    icon: FileText, // Ícono para reportes
  },
  // Puedes añadir más vistas aquí siguiendo el mismo patrón
];