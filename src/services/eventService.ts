// src/services/eventService.ts
import * as eventRepository from '../repositories/eventRepository';
import { CreateEventDTO, UpdateEventDTO } from '../types';

/**
 * Crea un nuevo evento a partir de los datos proporcionados.
 * @param organizerId - ID del usuario organizador.
 * @param data - Datos del evento a crear.
 * @returns El evento creado.
 */
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

/**
 * Obtiene los eventos asociados a un usuario.
 * @param userId - ID del usuario.
 * @param query - Parámetros de consulta (actualmente no se usan filtros avanzados).
 * @returns Lista de eventos.
 */
export const getEvents = async (
  userId: string,
  query: any,
): Promise<any> => {
  return eventRepository.findEventsByUser(userId, query);
};

/**
 * Actualiza un evento existente.
 * @param eventId - ID del evento a actualizar.
 * @param data - Datos a actualizar.
 * @returns El evento actualizado.
 */
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

/**
 * Realiza un soft delete sobre un evento.
 * @param eventId - ID del evento a eliminar.
 * @returns El evento actualizado con la marca de eliminación.
 */
export const deleteEvent = async (eventId: string): Promise<any> => {
  return eventRepository.softDeleteEvent(eventId);
};
