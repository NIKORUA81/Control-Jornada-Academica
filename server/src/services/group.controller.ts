import { Request, Response } from 'express';
import { getGroupsService } from '../services/group.service';
export const getGroupsController = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await getGroupsService());
  } catch (error) { res.status(500).json({ message: "Error" }); }
};