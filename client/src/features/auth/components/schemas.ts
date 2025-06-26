// Ruta: src/features/auth/components/schemas.ts

import { z } from 'zod';

/**
 * Esquema de validación para el formulario de inicio de sesión.
 */
export const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

/**
 * Esquema de validación para el formulario de registro.
 */
export const registerSchema = z.object({
    fullName: z.string().min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
    username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
    email: z.string().email({ message: "Por favor, introduce un email válido." }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

// --- Tipos Inferidos de los Esquemas ---

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;