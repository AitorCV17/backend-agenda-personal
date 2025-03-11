import { prisma } from '../config/prisma';

export const createSchedule = async (userId: string, startTime: Date, endTime: Date) => {
  return prisma.horario.create({
    data: {
      inicio: startTime,
      fin: endTime,
      usuarioId: userId,
    },
  });
};

export const getSchedules = async (userId: string) => {
  return prisma.horario.findMany({
    where: { usuarioId: userId },
  });
};
