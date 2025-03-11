import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/eventService';
import { CustomError } from '../utils/CustomError';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventData = req.body;
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const event = await eventService.createEvent(userId, eventData);
    return res.status(201).json(event);
  } catch (error) {
    next(new CustomError('Error al crear el evento', 500, 'CREATE_EVENT_ERROR'));
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const events = await eventService.getEvents(userId, req.query);
    return res.json(events);
  } catch (error) {
    next(new CustomError('Error al obtener los eventos', 500, 'GET_EVENTS_ERROR'));
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventData = req.body;
    const eventId = req.params.id;
    const updatedEvent = await eventService.updateEvent(eventId, eventData);
    return res.json(updatedEvent);
  } catch (error) {
    next(new CustomError('Error al actualizar el evento', 500, 'UPDATE_EVENT_ERROR'));
  }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = req.params.id;
    await eventService.deleteEvent(eventId);
    return res.json({ message: 'Evento eliminado (soft delete)' });
  } catch (error) {
    next(new CustomError('Error al eliminar el evento', 500, 'DELETE_EVENT_ERROR'));
  }
};
