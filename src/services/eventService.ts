import * as eventRepository from '../repositories/eventRepository';
import { CreateEventDTO, UpdateEventDTO } from '../types';

export const createEvent = async (
  organizerId: string,
  data: CreateEventDTO,
): Promise<any> => {
  return eventRepository.createEvent({
    titulo: data.titulo,
    descripcion: data.descripcion,
    ubicacion: data.ubicacion,
    fecha_inicio: new Date(data.fecha_inicio),
    fecha_fin: new Date(data.fecha_fin),
    organizadorId: organizerId,
  });
};

export const getEvents = async (
  userId: string,
  query: any,
): Promise<any> => {
  return eventRepository.findEventsByUser(userId, query);
};

export const updateEvent = async (
  eventId: string,
  data: UpdateEventDTO,
): Promise<any> => {
  return eventRepository.updateEvent(eventId, {
    titulo: data.titulo,
    descripcion: data.descripcion,
    ubicacion: data.ubicacion,
    fecha_inicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
    fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
  });
};

export const deleteEvent = async (eventId: string): Promise<any> => {
  return eventRepository.softDeleteEvent(eventId);
};
