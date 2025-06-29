import { describe, it, expect } from "vitest";
import { createScheduleSchema, updateScheduleSchema } from "../src/dtos/schedule.dto";

describe("schedule.dto.ts", () => {
  it("should validate a correct createSchedule payload", () => {
    const result = createScheduleSchema.safeParse({
      fecha: "2025-06-30",
      hora_inicio: 540,
      hora_fin: 600,
      modalidad: "PRESENCIAL",
      aula: "A101",
      teacherId: "b86a7b70-1b4a-4f0c-bec0-28e9f37b8a42",
      subjectId: "b33c1dc7-23a2-4fa7-85fa-81511e5c823f",
      groupId: "fa48b573-1772-49e1-a0f4-5a8e3c51c85f",
      observaciones: "Ninguna",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fecha).toBeInstanceOf(Date);
    }
  });

  it("should fail if hora_fin is before hora_inicio in create", () => {
    const result = createScheduleSchema.safeParse({
      fecha: "2025-06-30",
      hora_inicio: 600,
      hora_fin: 500,
      modalidad: "PRESENCIAL",
      aula: "A101",
      teacherId: "b86a7b70-1b4a-4f0c-bec0-28e9f37b8a42",
      subjectId: "b33c1dc7-23a2-4fa7-85fa-81511e5c823f",
      groupId: "fa48b573-1772-49e1-a0f4-5a8e3c51c85f",
      observaciones: "Ninguna",
    });

    expect(result.success).toBe(false);
  });

  it("should validate a partial update payload", () => {
    const result = updateScheduleSchema.safeParse({
      hora_inicio: 480,
      hora_fin: 540,
    });

    expect(result.success).toBe(true);
  });

  it("should fail update if hora_fin < hora_inicio and both provided", () => {
    const result = updateScheduleSchema.safeParse({
      hora_inicio: 600,
      hora_fin: 500,
    });

    expect(result.success).toBe(false);
  });
});
