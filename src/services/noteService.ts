import { prisma } from '../config/prisma';

export const createNote = async (userId: string, title: string, content: string) => {
  return prisma.nota.create({
    data: {
      titulo: title,
      contenido: content,
      usuarioId: userId,
    },
  });
};

export const getNotes = async (userId: string) => {
  return prisma.nota.findMany({
    where: { usuarioId: userId },
  });
};
