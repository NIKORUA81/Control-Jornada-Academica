// server/src/dtos/schedule.dto.ts
import { z } from 'zod';
import { Modality } from '@prisma/client'; // Importar enums de Prisma

export const createScheduleSchema = z.object({
  fecha: z.string({ required_error: "La fecha es requerida." })
    .transform((dateStr, ctx) => {
      // Intenta parsear la fecha. ISO 8601 (YYYY-MM-DD) es lo más común.
      // Date.parse devuelve NaN para formatos inválidos o no reconocidos.
      // new Date(string) también puede ser indulgente, así que un check de formato puede ser bueno.
      // Para simplificar, asumimos que el cliente envía un string que new Date() puede parsear.
      // Para mayor robustez, se podría usar una librería como date-fns o moment, o regex más estricto.
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "Formato de fecha inválido. Use YYYY-MM-DD.",
        });
        return z.NEVER; // Evita que Zod continúe con un valor inválido
      }
      // Normalizar a medianoche para evitar problemas de zona horaria si solo importa la fecha
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }),
  hora_inicio: z.number({
    required_error: "La hora de inicio es requerida.",
    invalid_type_error: "La hora de inicio debe ser un número (minutos desde medianoche)."
  }).int({ message: "La hora de inicio debe ser un número entero."})
    .min(0, { message: "La hora de inicio no puede ser menor a 0 (00:00)." })
    .max(1439, { message: "La hora de inicio no puede ser mayor a 1439 (23:59)." }), // 23*60 + 59
  hora_fin: z.number({
    required_error: "La hora de fin es requerida.",
    invalid_type_error: "La hora de fin debe ser un número (minutos desde medianoche)."
  }).int({ message: "La hora de fin debe ser un número entero."})
    .min(0, { message: "La hora de fin no puede ser menor a 0 (00:00)." })
    .max(1439, { message: "La hora de fin no puede ser mayor a 1439 (23:59)." }),
  modalidad: z.nativeEnum(Modality, {
    errorMap: () => ({ message: "Modalidad inválida. Valores permitidos: PRESENCIAL, VIRTUAL, HIBRIDA." })
  }),
  aula: z.string().max(50, "El aula no puede tener más de 50 caracteres.").trim().optional().nullable(),
  teacherId: z.string({ required_error: "El ID del docente es requerido." }).uuid({ message: "ID de docente debe ser un UUID válido."}),
  subjectId: z.string({ required_error: "El ID de la materia es requerido." }).uuid({ message: "ID de materia debe ser un UUID válido."}),
  groupId: z.string({ required_error: "El ID del grupo es requerido." }).uuid({ message: "ID de grupo debe ser un UUID válido."}),
  observaciones: z.string().max(500, "Las observaciones no pueden exceder los 500 caracteres.").trim().optional().nullable(),
}).refine(data => data.hora_fin > data.hora_inicio, {
  message: "La hora de fin debe ser posterior a la hora de inicio.",
  path: ["hora_fin"],
});

export type CreateScheduleDto = z.infer<typeof createScheduleSchema>;

export const updateScheduleSchema = createScheduleSchema.partial().refine(
  (data) => {
    // Si ambas horas están presentes, deben ser lógicas.
    if (data.hora_inicio !== undefined && data.hora_fin !== undefined) {
      return data.hora_fin > data.hora_inicio;
    }
    // Si solo una se actualiza, esta validación de interdependencia no aplica directamente aquí.
    // El servicio tendría que cargar la otra hora del schedule existente para validar.
    // Por simplicidad, este refine solo actúa si ambas están en el payload de actualización.
    return true;
  },
  {
    message: "La hora de fin debe ser posterior a la hora de inicio si ambas se actualizan.",
    path: ["hora_fin"],
  }
);

export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>;
