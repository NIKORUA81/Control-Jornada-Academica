// client/src/types/enums.ts

// Estos enums deben coincidir con los definidos en server/prisma/schema.prisma

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  COORDINADOR = 'COORDINADOR',
  ASISTENTE = 'ASISTENTE',
  DOCENTE = 'DOCENTE',
}

export enum Modality {
  PRESENCIAL = 'PRESENCIAL',
  VIRTUAL = 'VIRTUAL',
  HIBRIDA = 'HIBRIDA',
}

export enum ScheduleStatus {
  PROGRAMADO = 'PROGRAMADO',
  EN_CURSO = 'EN_CURSO', // Asegúrate que este valor exista en tu Prisma Enum o ajústalo
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}
