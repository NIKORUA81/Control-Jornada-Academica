// client/src/features/userManagement/components/UserCreateForm.tsx
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUserSchema, type CreateUserFormData } from './userSchemas';
import { UserRole } from '@/types/enums'; // Para el valor por defecto del rol

interface UserCreateFormProps {
  onSubmit: SubmitHandler<CreateUserFormData>;
  onCancel?: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<CreateUserFormData>;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}) => {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultValues || {
      email: '',
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      role: UserRole.DOCENTE, // Valor por defecto para el rol
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Correo Electrónico</FormLabel>
            <FormControl><Input type="email" placeholder="usuario@ejemplo.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="username" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de Usuario</FormLabel>
            <FormControl><Input placeholder="nombre.usuario" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="fullName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre Completo</FormLabel>
            <FormControl><Input placeholder="Nombre Apellido" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="password" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Contraseña</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="confirmPassword" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmar Contraseña</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger id="role-create"><SelectValue placeholder="Seleccione un rol" /></SelectTrigger></FormControl>
              <SelectContent>
                {Object.values(UserRole).map(roleValue => (
                  <SelectItem key={roleValue} value={roleValue}>
                    {/* Podríamos tener un mapeo para nombres más amigables si es necesario */}
                    {roleValue.charAt(0).toUpperCase() + roleValue.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
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
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
