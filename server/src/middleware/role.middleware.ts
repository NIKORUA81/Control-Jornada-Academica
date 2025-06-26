import { Request, Response, NextFunction } from 'express';

// Extendemos el tipo Request para que incluya el usuario del authMiddleware
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Esta función es un "generador de middlewares"
export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Primero, nos aseguramos de que el usuario exista en la petición (puesto por authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Acceso denegado.' });
    }

    const { role } = req.user;

    // Comprobamos si el rol del usuario está en la lista de roles permitidos
    if (allowedRoles.includes(role)) {
      next(); // El usuario tiene el rol correcto, puede continuar
    } else {
      res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
    }
  };
};