// server/src/dtos/scheduleReportFilter.dto.ts
import { z } from 'zod';
import { Modality, ScheduleStatus } from '@prisma/client';

// Helper para transformar 'all' o string vacío a undefined, y luego validar el tipo específico o permitir undefined.
const optionalWithAll = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(val => (val === 'all' || val === '' || val === null ? undefined : val), schema.optional());

export const scheduleReportFilterSchema = z.object({
  teacherId: optionalWithAll(z.string().uuid({ message: "ID de docente debe ser un UUID válido."})),
  month: optionalWithAll(
    z.coerce.number({ invalid_type_error: "El mes debe ser un número." })
      .int({ message: "El mes debe ser un número entero." })
      .min(1, { message: "El mes debe estar entre 1 y 12." })
      .max(12, { message: "El mes debe estar entre 1 y 12." })
  ),
  year: optionalWithAll(
    z.coerce.number({ invalid_type_error: "El año debe ser un número." })
      .int({ message: "El año debe ser un número entero." })
      .min(2020, { message: "El año no puede ser anterior a 2020." }) // Ajustar según necesidad
      .max(new Date().getFullYear() + 5, { message: `El año no puede ser mayor a ${new Date().getFullYear() + 5}.`}) // Año actual + 5
  ),
  subjectId: optionalWithAll(z.string().uuid({ message: "ID de materia debe ser un UUID válido."})),
  groupId: optionalWithAll(z.string().uuid({ message: "ID de grupo debe ser un UUID válido."})),
  status: optionalWithAll(
    z.nativeEnum(ScheduleStatus, {
      errorMap: () => ({ message: `Estado de horario inválido. Valores permitidos: ${Object.values(ScheduleStatus).join(', ')}` })
    })
  ),
  modality: optionalWithAll(
    z.nativeEnum(Modality, {
      errorMap: () => ({ message: `Modalidad inválida. Valores permitidos: ${Object.values(Modality).join(', ')}` })
    })
  ),

  // Ejemplo de paginación (opcional, pero bueno para reportes potencialmente largos)
  // page: z.coerce.number().int().positive().optional().default(1),
  // limit: z.coerce.number().int().positive().min(1).max(100).optional().default(50), // Max 100 por página
});

export type ScheduleReportFilterDto = z.infer<typeof scheduleReportFilterSchema>;
