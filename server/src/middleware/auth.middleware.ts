import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos el tipo Request de Express para añadir nuestra propiedad 'user'
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
    req.user = decoded; // Añadimos el payload del token a la petición
    next(); // La petición continúa hacia el controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};