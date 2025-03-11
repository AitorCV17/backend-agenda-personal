import { prisma } from '../config/prisma';

interface DatosRefreshToken {
  usuarioId: string;
  token: string;
  fecha_expiracion: Date;
}

export const crearRefreshToken = async (datos: DatosRefreshToken) => {
  return prisma.refreshToken.create({ data: datos });
};

export const buscarRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const eliminarRefreshToken = async (token: string) => {
  return prisma.refreshToken.delete({
    where: { token },
  });
};

export const eliminarRefreshTokensUsuario = async (usuarioId: string) => {
  return prisma.refreshToken.deleteMany({
    where: { usuarioId },
  });
};
