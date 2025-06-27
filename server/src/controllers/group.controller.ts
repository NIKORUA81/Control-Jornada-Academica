import { Request, Response } from 'express';
import { getGroupsService, createGroupService } from '../services/group.service';
import { CreateGroupDto } from '../dtos/group.dto'; // Importar para tipar req.body si es necesario
import { Prisma } from '@prisma/client'; // Para el manejo de errores de Prisma

export const getGroupsController = async (req: Request, res: Response) => {
  try {
    const groups = await getGroupsService();
    res.status(200).json(groups);
  } catch (error: any) {
    console.error("Error en getGroupsController:", error);
    res.status(500).json({ message: 'Error al obtener los grupos', error: error.message });
  }
};

export const createGroupController = async (req: Request, res: Response) => {
  try {
    // req.body ya ha sido validado y transformado por el middleware validateRequestBody
    // y ahora se ajusta al tipo CreateGroupDto.
    const groupData: CreateGroupDto = req.body;
    const newGroup = await createGroupService(groupData);
    res.status(201).json(newGroup);
  } catch (error: any) {
    console.error("Error en createGroupController:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 es el código de error para violación de constraint único en Prisma
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        let fieldMessage = "un valor único";
        if (target && target.includes('code')) {
          fieldMessage = "el código proporcionado";
        }
        // Podríamos añadir más checks para otros campos únicos si los hubiera
        return res.status(409).json({
          message: `Error al crear el grupo: Ya existe un grupo con ${fieldMessage}.`,
        });
      }
    }
    // Error genérico si no es un error conocido de Prisma que queramos manejar específicamente
    res.status(400).json({ message: 'Error al crear el grupo.', error: error.message });
  }
};