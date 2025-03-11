import { prisma } from '../config/prisma';
import { Rol } from '@prisma/client';
import { RegisterUserDTO, UpdateUserDTO } from '../dtos/UserDTO';

export const crearUsuario = async (
  datos: RegisterUserDTO & { password: string; rol?: Rol }
) => {
  return prisma.usuario.create({ data: datos });
};

export const buscarPorEmail = async (email: string) => {
  return prisma.usuario.findUnique({ where: { email } });
};

export const buscarPorId = async (id: string) => {
  return prisma.usuario.findUnique({ where: { id } });
};

export const actualizarUsuario = async (id: string, datos: UpdateUserDTO) => {
  return prisma.usuario.update({ where: { id }, data: datos });
};
