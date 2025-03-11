import { prisma } from '../config/prisma';

export const createCalendar = async (userId: string, title: string) => {
  return prisma.calendario.create({
    data: {
      titulo: title,
      usuarioId: userId,
    },
  });
};

export const getCalendars = async (userId: string) => {
  return prisma.calendario.findMany({
    where: { usuarioId: userId },
  });
};
