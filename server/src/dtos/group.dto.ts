// server/src/dtos/group.dto.ts
import { z } from 'zod';

export const createGroupSchema = z.object({
  code: z.string({
    required_error: "El código del grupo es requerido.",
  }).min(3, "El código debe tener al menos 3 caracteres.")
    .max(20, "El código no puede tener más de 20 caracteres.")
    .trim(), // Añadido trim para limpiar espacios
  name: z.string({
    required_error: "El nombre del grupo es requerido.",
  }).min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede tener más de 100 caracteres.")
    .trim(), // Añadido trim
  semester: z.number({
    required_error: "El semestre es requerido.",
    invalid_type_error: "El semestre debe ser un número.",
  }).int({ message: "El semestre debe ser un número entero."})
    .positive({ message: "El semestre debe ser un número positivo."})
    .min(1, { message: "El semestre debe ser como mínimo 1."})
    .max(16, { message: "El semestre no puede ser mayor a 16."}),
  year: z.number({
    required_error: "El año es requerido.",
    invalid_type_error: "El año debe ser un número.",
  }).int({ message: "El año debe ser un número entero."})
    .min(new Date().getFullYear(), { message: `El año debe ser el actual (${new Date().getFullYear()}) o uno futuro.`})
    .max(new Date().getFullYear() + 5, { message: `El año no puede ser mayor a ${new Date().getFullYear() + 5}.`}),
  max_students: z.number({
    invalid_type_error: "El número máximo de estudiantes debe ser un número.",
  }).int({ message: "El número máximo de estudiantes debe ser un número entero."})
    .positive({ message: "El número máximo de estudiantes debe ser positivo."})
    .optional()
    .default(30),
  subjectIds: z.array(z.string().uuid({ message: "Cada ID de materia debe ser un UUID válido."}))
    .optional()
    .default([]),
});

// Exportamos el tipo inferido para usarlo en los servicios y controladores
export type CreateGroupDto = z.infer<typeof createGroupSchema>;
