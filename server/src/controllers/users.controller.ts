import { Request, Response } from 'express';
import { getAllUsersService, updateUserService } from '../services/user.service';

/**
 * Controlador para obtener la lista de todos los usuarios.
 * Maneja la petición GET a /api/users.
 */
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener los usuarios.", error: error.message });
  }
};

/**
 * Controlador para actualizar la información de un usuario por su ID.
 * Maneja la petición PATCH a /api/users/:id.
 */
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserService(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(404).json({ message: 'No se pudo actualizar el usuario.', error: error.message });
  }
};