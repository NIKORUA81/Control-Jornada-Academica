import { Request, Response } from 'express';
import { getSubjectsService } from '../services/subject.service';
export const getSubjectsController = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await getSubjectsService());
  } catch (error) { res.status(500).json({ message: "Error" }); }
};