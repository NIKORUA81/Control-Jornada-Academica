/**
 * @file GroupForm.tsx
 * Componente reutilizable para el formulario de creación y edición de Grupos.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

// Importaciones de componentes de UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Importación de servicios de API y tipos
import { getSubjects, type ApiSubject } from '@/api/subjectService';

// Esquema de validación con Zod para el formulario de grupo
const groupSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  code: z.string().min(1, "El código es requerido."),
  semester: z.coerce.number().min(1, "El semestre debe ser al menos 1."),
  year: z.coerce.number().min(2020, "El año debe ser válido."),
  subjectId: z.string().min(1, "Debes seleccionar una materia."),
});

// Se infiere el tipo de TypeScript a partir del esquema de Zod
export type GroupFormData = z.infer<typeof groupSchema>;

// Define las props que el componente espera recibir
interface GroupFormProps {
  onSubmit: (data: GroupFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<GroupFormData>;
}

export const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel, isSubmitting, defaultValues }) => {
  // Obtenemos la lista de materias para poblar el selector
  const { data: subjects } = useQuery<ApiSubject[]>({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues || {
      name: '',
      code: '',
      semester: 1,
      year: new Date().getFullYear(),
      subjectId: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Grupo</FormLabel>
            <FormControl><Input placeholder="Ej: Grupo A de Cálculo" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="code" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Código del Grupo</FormLabel>
            <FormControl><Input placeholder="Ej: MAT-101-A" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="subjectId" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Materia Asociada</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Selecciona una materia..." /></SelectTrigger></FormControl>
              <SelectContent>
                {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField name="semester" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Semestre</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="year" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Año</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Grupo'}</Button>
        </div>
      </form>
    </Form>
  );
};