import { Request, Response } from 'express';
import { getDashboardStatsService } from '../services/dashboard.service';

export const getDashboardStatsController = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las estadísticas del dashboard", error });
  }
};