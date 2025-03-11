import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';

export const createEvent = async (data: Prisma.EventoCreateInput) => {
  // Se utiliza EventoCreateInput, ya que las versiones "Unchecked" no están exportadas.
  return prisma.evento.create({ data });
};

export const findEventsByUser = async (userId: string, query: any) => {
  return prisma.evento.findMany({
    // Se usa la propiedad "eliminadoEn" (definida en el schema) para filtrar los eventos activos
    where: { organizadorId: userId, eliminadoEn: null },
  });
};

export const updateEvent = async (eventId: string, data: Prisma.EventoUpdateInput) => {
  return prisma.evento.update({
    where: { id: eventId },
    data,
  });
};

export const softDeleteEvent = async (eventId: string) => {
  return prisma.evento.update({
    where: { id: eventId },
    data: { eliminadoEn: new Date() },
  });
};
