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
    where: { usuarioId: userId, eliminadoEn: null },
  });
};

export const updateNote = async (noteId: string, title: string, content: string) => {
  return prisma.nota.update({
    where: { id: noteId },
    data: { titulo: title, contenido: content },
  });
};

export const deleteNote = async (noteId: string) => {
  return prisma.nota.update({
    where: { id: noteId },
    data: { eliminadoEn: new Date() },
  });
};
