// server/src/dtos/schedule.dto.ts

import { z } from "zod";
import { Modality } from "@prisma/client";

// BASE SCHEMA sin transforms ni refine
const baseScheduleSchema = z.object({
  fecha: z.string({
    required_error: "La fecha es requerida.",
  }),
  hora_inicio: z
    .number({
      required_error: "La hora de inicio es requerida.",
      invalid_type_error: "La hora de inicio debe ser un número (minutos desde medianoche).",
    })
    .int()
    .min(0)
    .max(1439),
  hora_fin: z
    .number({
      required_error: "La hora de fin es requerida.",
      invalid_type_error: "La hora de fin debe ser un número (minutos desde medianoche).",
    })
    .int()
    .min(0)
    .max(1439),
  modalidad: z.nativeEnum(Modality, {
    errorMap: () => ({
      message: "Modalidad inválida. Valores permitidos: PRESENCIAL, VIRTUAL, HIBRIDA.",
    }),
  }),
  aula: z
    .string()
    .max(50, "El aula no puede tener más de 50 caracteres.")
    .trim()
    .optional()
    .nullable(),
  teacherId: z.string().uuid(),
  subjectId: z.string().uuid(),
  groupId: z.string().uuid(),
  observaciones: z
    .string()
    .max(500, "Las observaciones no pueden exceder los 500 caracteres.")
    .trim()
    .optional()
    .nullable(),
});

// CREATE SCHEMA
export const createScheduleSchema = baseScheduleSchema
  .extend({
    fecha: baseScheduleSchema.shape.fecha.transform((dateStr, ctx) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "Formato de fecha inválido. Use YYYY-MM-DD.",
        });
        return z.NEVER;
      }
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }),
  })
  .refine((data) => data.hora_fin > data.hora_inicio, {
    message: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["hora_fin"],
  });

export type CreateSchedule = z.infer<typeof createScheduleSchema>;

// UPDATE SCHEMA
export const updateScheduleSchema = baseScheduleSchema
  .partial()
  .refine(
    (data) => {
      if (data.hora_inicio !== undefined && data.hora_fin !== undefined) {
        return data.hora_fin > data.hora_inicio;
      }
      return true;
    },
    {
      message: "La hora de fin debe ser posterior a la hora de inicio si ambas están presentes.",
      path: ["hora_fin"],
    }
  );

export type UpdateScheduleDto = z.infer<typeof updateScheduleSchema>;
