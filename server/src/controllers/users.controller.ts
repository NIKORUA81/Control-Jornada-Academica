import { Request, Response } from 'express';
import { getAllUsersService, updateUserService, createUserService } from '../services/user.service'; // Importar createUserService
import { Prisma } from '@prisma/client'; // Para el tipo de datos de creación

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
 * Controlador para crear un nuevo usuario.
 * Maneja la petición POST a /api/users.
 */
export const createUserController = async (req: Request, res: Response) => {
  try {
    // Los datos del usuario vendrán en req.body
    // Es crucial validar estos datos antes de pasarlos al servicio.
    // Zod u otra librería de validación debería usarse aquí en un proyecto real.
    // Por ahora, asumimos que los datos son correctos según CreateUserPayload del frontend.
    const userData: Prisma.UserCreateInput = req.body;
    const newUser = await createUserService(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    // Manejo de errores específicos (ej. usuario ya existe, datos inválidos)
    if (error.message.includes('Unique constraint failed')) { // Ejemplo de error de Prisma
        return res.status(409).json({ message: 'Error al crear el usuario: El email o nombre de usuario ya existe.', error: error.message });
    }
    res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
  }
};


/**
 * Controlador para actualizar la información de un usuario por su ID.
 * Maneja la petición PATCH a /api/users/:id.
 */
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Similar a create, req.body debería ser validado aquí.
    // El tipo de req.body debería ser compatible con UpdateUserData del servicio.
    const updatedUser = await updateUserService(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(404).json({ message: 'No se pudo actualizar el usuario.', error: error.message });
  }
};