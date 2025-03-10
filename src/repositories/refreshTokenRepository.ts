import { prisma } from '../config/prisma';

interface RefreshTokenData {
  usuarioId: string;
  token: string;
  fecha_expiracion: Date;
}

export const createRefreshToken = async (data: RefreshTokenData) => {
  return prisma.refreshToken.create({ data });
};

export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
  });
};

export const deleteRefreshToken = async (token: string) => {
  return prisma.refreshToken.delete({
    where: { token },
  });
};

export const deleteRefreshTokensByUser = async (usuarioId: string) => {
  return prisma.refreshToken.deleteMany({
    where: { usuarioId },
  });
};
