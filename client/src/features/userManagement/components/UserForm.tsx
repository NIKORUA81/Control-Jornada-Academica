import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type CreateUserFormData, type UpdateUserFormData, createUserSchema, updateUserSchema } from './userSchemas';

// Definimos un tipo que pueda ser CreateUserFormData o UpdateUserFormData
export type UserFormDataType = CreateUserFormData | UpdateUserFormData;

interface UserFormProps<TFormData extends UserFormDataType> {
  mode: 'create' | 'edit';
  schema: z.ZodType<TFormData>;
  onSubmit: SubmitHandler<TFormData>;
  onCancel?: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<TFormData>;
}

export const UserForm = <TFormData extends UserFormDataType>({
  mode,
  schema,
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
}: UserFormProps<TFormData>) => {
  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any, // react-hook-form defaultValues can be partial
  });

  const submitButtonText = mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios';
  const submittingButtonText = mode === 'create' ? 'Creando...' : 'Guardando...';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campos comunes o condicionales para 'create' y 'edit' */}
        {mode === 'create' && (
          <>
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
          </>
        )}

        <FormField name="fullName" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre Completo</FormLabel>
            <FormControl><Input placeholder="Nombre Apellido" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {mode === 'create' && (
          <>
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
          </>
        )}

        <FormField name="role" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
              <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un rol" /></SelectTrigger></FormControl>
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

        {/* Podríamos añadir el campo isActive si quisiéramos controlarlo desde el formulario
        {schema.shape.isActive && ( // Comprobar si el esquema actual tiene 'isActive'
            <FormField name="isActive" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Activo</FormLabel>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </FormItem>
            )} />
        )}
        */}

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? submittingButtonText : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};