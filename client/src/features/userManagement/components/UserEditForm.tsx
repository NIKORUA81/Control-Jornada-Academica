// client/src/features/userManagement/components/UserEditForm.tsx
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserSchema, type UpdateUserFormData } from './userSchemas';
import { UserRole } from '@/types/enums'; // Para el enum UserRole

interface UserEditFormProps {
  onSubmit: SubmitHandler<UpdateUserFormData>;
  onCancel?: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<UpdateUserFormData>; // fullName y role
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}) => {
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: defaultValues || {
      fullName: '',
      role: UserRole.DOCENTE, // Un valor por defecto razonable
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="fullName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre Completo</FormLabel>
            <FormControl><Input placeholder="Nombre Apellido" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger id="role-edit"><SelectValue placeholder="Seleccione un rol" /></SelectTrigger></FormControl>
              <SelectContent>
                {Object.values(UserRole).map(roleValue => (
                  <SelectItem key={roleValue} value={roleValue}>
                    {roleValue.charAt(0).toUpperCase() + roleValue.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Si se quisiera añadir isActive:
        <FormField
          control={form.control}
          name="isActive" // Asegúrate que isActive está en updateUserSchema y UpdateUserFormData
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Estado Activo</FormLabel>
                <FormDescription>
                  Define si el usuario está activo o inactivo en el sistema.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        */}

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
