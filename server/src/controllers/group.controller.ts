import { Request, Response } from 'express';
import { getGroupsService, createGroupService } from '../services/group.service';

export const getGroupsController = async (req: Request, res: Response) => {
  try {
    const groups = await getGroupsService();
    res.status(200).json(groups);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los grupos', error: error.message });
  }
};

// --- AÑADIR ESTE CONTROLADOR ---
export const createGroupController = async (req: Request, res: Response) => {
  try {
    const newGroup = await createGroupService(req.body);
    res.status(201).json(newGroup);
  } catch (error: any) {
    res.status(400).json({ message: 'Error al crear el grupo', error: error.message });
  }
};