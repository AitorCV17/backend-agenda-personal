import * as eventRepository from '../repositories/eventRepository';

// DTO con snake_case para las fechas, si así las recibe el frontend
export interface CreateEventDTO {
  titulo: string;
  descripcion?: string;
  ubicacion?: string;
  fecha_inicio: string | Date; // Permite string o Date
  fecha_fin: string | Date;    // Permite string o Date
}

export interface UpdateEventDTO {
  titulo?: string;
  descripcion?: string;
  ubicacion?: string;
  fecha_inicio?: string | Date; // Permite string o Date
  fecha_fin?: string | Date;    // Permite string o Date
}

export const createEvent = async (
  organizadorId: string, // Se utiliza para conectar al usuario organizador
  data: CreateEventDTO,
): Promise<any> => {
  return eventRepository.createEvent({
    titulo: data.titulo,
    descripcion: data.descripcion,
    ubicacion: data.ubicacion,
    // Convertimos las fechas a Date
    fechaInicio: new Date(data.fecha_inicio),
    fechaFin: new Date(data.fecha_fin),
    // Usamos la conexión anidada para relacionar el evento con el usuario
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
    // Convertimos las fechas si están presentes
    fechaInicio: data.fecha_inicio ? new Date(data.fecha_inicio) : undefined,
    fechaFin: data.fecha_fin ? new Date(data.fecha_fin) : undefined,
  });
};

export const deleteEvent = async (eventId: string): Promise<any> => {
  return eventRepository.softDeleteEvent(eventId);
};
