import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Esquema de validación para el formulario de edición/creación de usuario
const userSchema = z.object({
  fullName: z.string().min(3, "El nombre es requerido."),
  role: z.enum(['DOCENTE', 'COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN', 'DIRECTOR']),
});

// Exportamos el tipo para que otros componentes lo puedan usar
export type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel?: () => void; // onCancel es opcional
  isSubmitting: boolean;
  defaultValues?: Partial<UserFormData>;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isSubmitting, defaultValues }) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues || { fullName: '', role: 'DOCENTE' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="fullName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre Completo</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="DOCENTE">Docente</SelectItem>
                <SelectItem value="ASISTENTE">Asistente</SelectItem>
                <SelectItem value="COORDINADOR">Coordinador</SelectItem>
                <SelectItem value="DIRECTOR">Director</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="SUPERADMIN">Super Administrador</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancelar
              </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  );
};