// server/src/services/user.service.ts
import prisma from '../config/database';
import { Role } from '@prisma/client';

// --- FUNCIÓN PARA OBTENER TODOS LOS USUARIOS ---
export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
};

// --- FUNCIÓN PARA OBTENER UN PERFIL POR ID ---
export const getUserProfileById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};


// --- FUNCIÓN PARA ACTUALIZAR UN USUARIO ---
interface UpdateUserData {
  fullName?: string;
  username?: string;
  role?: Role;
  isActive?: boolean;
}

export const updateUserService = async (userId: string, data: UpdateUserData) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: data,
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    }
  });
  return updatedUser;
};