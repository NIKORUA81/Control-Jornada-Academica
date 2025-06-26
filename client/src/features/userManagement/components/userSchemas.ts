// client/src/features/userManagement/components/userSchemas.ts
import { z } from 'zod';

export const userBaseSchema = z.object({
  fullName: z.string().min(3, "El nombre completo es requerido y debe tener al menos 3 caracteres."),
  role: z.enum(['DOCENTE', 'COORDINADOR', 'ASISTENTE', 'ADMIN', 'SUPERADMIN', 'DIRECTOR'], {
    errorMap: () => ({ message: "Debe seleccionar un rol válido." })
  }),
  // isActive: z.boolean().optional(), // Opcional, si decidimos controlarlo desde el form
});

export const createUserSchema = userBaseSchema.extend({
  email: z.string().email("Debe ser un correo electrónico válido."),
  username: z.string().min(3, "El nombre de usuario es requerido y debe tener al menos 3 caracteres."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Debe confirmar la contraseña."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"], // path indica qué campo mostrará el error
});

export const updateUserSchema = userBaseSchema.extend({
  // Para la actualización, email y username podrían ser opcionales o no editables
  // dependiendo de las reglas de negocio. Por ahora, UserForm solo actualiza fullName y role.
  // Si se quisiera permitir la edición de email/username, se añadirían aquí.
  // Ejemplo si se permitiera editar email:
  // email: z.string().email("Debe ser un correo electrónico válido.").optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
