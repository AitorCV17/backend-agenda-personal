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
    where: { usuarioId: userId, eliminadoEn: null },
  });
};

export const updateCalendar = async (calendarId: string, title: string) => {
  return prisma.calendario.update({
    where: { id: calendarId },
    data: { titulo: title },
  });
};

export const deleteCalendar = async (calendarId: string) => {
  return prisma.calendario.update({
    where: { id: calendarId },
    data: { eliminadoEn: new Date() },
  });
};
