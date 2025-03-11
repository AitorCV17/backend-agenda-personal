import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as eventService from '../services/eventService';
import { CreateEventDTO, UpdateEventDTO } from '../types';
import { CustomError } from '../utils/CustomError';

export const createEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const eventData: CreateEventDTO = req.body;
    const event = await eventService.createEvent(req.user?.id, eventData);
    return res.status(201).json(event);
  } catch (error: any) {
    next(new CustomError('Error al crear el evento', 500, 'CREATE_EVENT_ERROR'));
  }
};

export const getEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const events = await eventService.getEvents(req.user?.id, req.query);
    return res.json(events);
  } catch (error: any) {
    next(new CustomError('Error al obtener los eventos', 500, 'GET_EVENTS_ERROR'));
  }
};

export const updateEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const eventData: UpdateEventDTO = req.body;
    const updatedEvent = await eventService.updateEvent(req.params.id, eventData);
    return res.json(updatedEvent);
  } catch (error: any) {
    next(new CustomError('Error al actualizar el evento', 500, 'UPDATE_EVENT_ERROR'));
  }
};

export const deleteEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    await eventService.deleteEvent(req.params.id);
    return res.json({ message: 'Evento eliminado (soft delete)' });
  } catch (error: any) {
    next(new CustomError('Error al eliminar el evento', 500, 'DELETE_EVENT_ERROR'));
  }
};
