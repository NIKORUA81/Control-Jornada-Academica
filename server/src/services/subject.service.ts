import prisma from '../config/database';
import { Subject } from '@prisma/client';

export const getSubjectsService = async () => {
  return await prisma.subject.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
};

// --- AÑADIR ESTA FUNCIÓN ---
export const createSubjectService = async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<Subject> => {
  return await prisma.subject.create({ data });
};