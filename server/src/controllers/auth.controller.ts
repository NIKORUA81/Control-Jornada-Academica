// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { registerUserService, loginUserService } from '../services/auth.service';
import { getUserProfileById } from '../services/user.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService(req.body);
    // No enviar la contraseña en la respuesta
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userWithoutPassword });
  } catch (error: any) {
    res.status(400).json({ message: 'Error en el registro', error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }
        const token = await loginUserService(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error: any) {
        // Enviar un 401 para errores de credenciales, 403 para cuenta inactiva
        if (error.message.includes('inactiva')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(401).json({ message: error.message });
    }
};

export const getProfileController = async (req: any, res: Response) => {
  try {
    // req.user.id viene del authMiddleware que decodificó el token
    const userProfile = await getUserProfileById(req.user.id);
    res.status(200).json(userProfile);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};