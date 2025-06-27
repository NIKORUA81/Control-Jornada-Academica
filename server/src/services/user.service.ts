// server/src/services/user.service.ts
import prisma from '../config/database';
import { Role, Prisma } from '@prisma/client'; // Importar Prisma para UserCreateInput
import bcrypt from 'bcryptjs'; // Importar bcryptjs

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
// (Esta función ya existe y es correcta)
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

// --- DATOS ESPERADOS PARA CREAR UN USUARIO ---
// Coincide con CreateUserPayload del frontend + password. Prisma.UserCreateInput es muy genérico.
// Podríamos definir un tipo más específico si es necesario para validación interna.
// Por ahora, confiamos en que el controlador pasa los campos correctos (email, username, fullName, password, role)
// y que el frontend ya ha validado la estructura.
export type CreateServiceUserData = Omit<Prisma.UserCreateInput, 'password'> & {
    password: string; // Aseguramos que password esté presente
};


// --- FUNCIÓN PARA CREAR UN NUEVO USUARIO ---
export const createUserService = async (userData: CreateServiceUserData) => {
  const { email, username, password, ...restOfData } = userData;

  // 1. Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Crear el usuario en la base de datos
  // Prisma se encargará de lanzar un error si hay violación de constraints (ej. email/username únicos)
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      ...restOfData, // fullName, role, isActive (si se envía)
      // isActive por defecto es true según el schema.prisma, así que no es necesario pasarlo
      // a menos que se quiera controlar explícitamente.
    },
    select: { // Devolver el usuario sin la contraseña
      id: true,
      email: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};


// --- FUNCIÓN PARA ACTUALIZAR UN USUARIO ---
// (Esta función ya existe y es correcta para los campos que maneja)
// El tipo UpdateUserData es simple, si se quieren validaciones más complejas o transformaciones,
// se podría usar un DTO más robusto.
export interface UpdateUserData {
  fullName?: string;
  // username?: string; // Si se permite editar username, añadir aquí y en el select
  // email?: string; // Si se permite editar email
  role?: Role;
  isActive?: boolean;
  // password?: string; // Si se permite cambiar contraseña, manejar hashing
}

export const updateUserService = async (userId: string, data: UpdateUserData) => {
  // Si se permite actualizar la contraseña, se necesitaría hashearla aquí también
  // if (data.password) {
  //   data.password = await bcrypt.hash(data.password, 10);
  // }

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
      updatedAt: true, // Añadir updatedAt
    }
  });
  return updatedUser;
};