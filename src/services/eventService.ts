import * as eventRepository from '../repositories/eventRepository';

// DTO con camelCase para las fechas
export interface CreateEventDTO {
  titulo: string;
  descripcion?: string;
  ubicacion?: string;
  fechaInicio: string | Date; // Permite string o Date
  fechaFin: string | Date;    // Permite string o Date
}

export interface UpdateEventDTO {
  titulo?: string;
  descripcion?: string;
  ubicacion?: string;
  fechaInicio?: string | Date;
  fechaFin?: string | Date;
}

export const createEvent = async (
  organizadorId: string,
  data: CreateEventDTO,
): Promise<any> => {
  return eventRepository.createEvent({
    titulo: data.titulo,
    descripcion: data.descripcion,
    ubicacion: data.ubicacion,
    fechaInicio: new Date(data.fechaInicio),
    fechaFin: new Date(data.fechaFin),
    organizador: {
      connect: { id: organizadorId },
    },
  });
};

export const getEvents = async (userId: string, query: any): Promise<any> => {
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
    fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : undefined,
    fechaFin: data.fechaFin ? new Date(data.fechaFin) : undefined,
  });
};

export const deleteEvent = async (eventId: string): Promise<any> => {
  return eventRepository.softDeleteEvent(eventId);
};
