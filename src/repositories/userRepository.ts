import { prisma } from '../config/prisma';
import { Rol } from '@prisma/client';
import { RegisterUserDTO, UpdateUserDTO } from '../dtos/UserDTO';

export const createUser = async (
  data: RegisterUserDTO & { password: string; rol?: Rol }
) => {
  return prisma.usuario.create({ data });
};

export const findByEmail = async (email: string) => {
  return prisma.usuario.findUnique({ where: { email } });
};

export const findById = async (id: string) => {
  return prisma.usuario.findUnique({ where: { id } });
};

export const updateUser = async (id: string, data: UpdateUserDTO) => {
  return prisma.usuario.update({ where: { id }, data });
};
