import prisma from '../config/database';
import { Group } from '@prisma/client';

export const getGroupsService = async () => {
  return await prisma.group.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
};

// --- AÑADIR ESTA FUNCIÓN ---
export const createGroupService = async (data: Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<Group> => {
  return await prisma.group.create({ data });
};