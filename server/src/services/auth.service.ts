// src/services/auth.service.ts
import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

// Tipo para los datos de registro, excluyendo el id y fechas
type RegisterData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;

export const registerUserService = async (userData: RegisterData): Promise<User> => {
  const { email, username, password, ...rest } = userData;

  // 1. Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Crear el usuario en la base de datos
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      ...rest,
    },
  });

  return user;
};

export const loginUserService = async (email: string, pass: string): Promise<string> => {
    // 1. Encontrar al usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Credenciales inválidas'); // Mensaje genérico por seguridad
    }

    // 2. Verificar que la cuenta esté activa
    if (!user.isActive) {
        throw new Error('La cuenta de usuario está inactiva');
    }

    // 3. Comparar la contraseña proporcionada con la almacenada
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
    }

    // 4. Generar el token JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('La clave secreta JWT no está configurada');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: '1d' } // El token expira en 1 día
    );

    return token;
};