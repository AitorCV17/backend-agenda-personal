import { prisma } from '../config/prisma';
import { CreateEventDTO, UpdateEventDTO } from '../types';

export const createEvent = async (
  data: CreateEventDTO & { organizadorId: string },
) => {
  return prisma.evento.create({ data });
};

export const findEventsByUser = async (userId: string, query: any) => {
  return prisma.evento.findMany({
    where: { organizadorId: userId, deleted_at: null },
  });
};

export const updateEvent = async (eventId: string, data: UpdateEventDTO) => {
  return prisma.evento.update({
    where: { id: eventId },
    data,
  });
};

export const softDeleteEvent = async (eventId: string) => {
  return prisma.evento.update({
    where: { id: eventId },
    data: { deleted_at: new Date() },
  });
};
