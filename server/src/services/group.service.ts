import prisma from '../config/database';
import { Group, Prisma } from '@prisma/client'; // Importar Prisma para tipos de input
import { CreateGroupDto } from '../dtos/group.dto'; // Importar el DTO

export const getGroupsService = async () => {
  return await prisma.group.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { subjects: true } // Incluir materias asociadas si es necesario para la vista de lista
  });
};

export const createGroupService = async (data: CreateGroupDto): Promise<Group> => {
  const { subjectIds, ...groupData } = data;

  // Preparamos los datos para la creación del grupo
  const groupCreateInput: Prisma.GroupCreateInput = {
    ...groupData, // code, name, semester, year, max_students
  };

  // Si se proporcionan subjectIds, los conectamos al grupo
  if (subjectIds && subjectIds.length > 0) {
    groupCreateInput.subjects = {
      connect: subjectIds.map(id => ({ id })),
    };
  }

  // isActive y defaults de fechas son manejados por Prisma schema
  return await prisma.group.create({
    data: groupCreateInput,
    include: { // Incluir materias en la respuesta para confirmar la creación
      subjects: true,
    }
  });
};

// Podríamos añadir más servicios para grupos, como:
// export const getGroupByIdService = async (id: string) => { ... }
// export const updateGroupService = async (id: string, data: UpdateGroupDto) => { ... }
// export const deleteGroupService = async (id: string) => { ... }
// export const addSubjectToGroupService = async (groupId: string, subjectId: string) => { ... }
// export const removeSubjectFromGroupService = async (groupId: string, subjectId: string) => { ... }