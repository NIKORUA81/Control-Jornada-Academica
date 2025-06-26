import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const subjectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  code: z.string().min(3, "El código debe tener al menos 3 caracteres."),
  credits: z.coerce.number().min(1, "Los créditos deben ser al menos 1."),
  description: z.string().optional(),
});

export type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
    onSubmit: (data: SubjectFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    defaultValues?: Partial<SubjectFormData>;
  }
  
  export const SubjectForm: React.FC<SubjectFormProps> = ({ onSubmit, onCancel, isSubmitting, defaultValues }) => {
    const form = useForm<SubjectFormData>({
      resolver: zodResolver(subjectSchema),
      defaultValues: defaultValues || { name: '', code: '', credits: 1, description: '' },
    });
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Materia</FormLabel>
              <FormControl><Input placeholder="Ej: Cálculo Diferencial" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="code" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl><Input placeholder="Ej: MAT-101" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="credits" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Créditos</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl><Textarea placeholder="Contenido de la materia..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Materia'}</Button>
          </div>
        </form>
      </Form>
    );
  };