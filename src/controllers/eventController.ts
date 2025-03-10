import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as eventService from '../services/eventService';
import { CreateEventDTO, UpdateEventDTO } from '../types';

export const createEvent = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const eventData: CreateEventDTO = req.body;
    const event = await eventService.createEvent(req.user?.id, eventData);
    return res.status(201).json(event);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al crear el evento' });
  }
};

export const getEvents = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const events = await eventService.getEvents(req.user?.id, req.query);
    return res.json(events);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al obtener los eventos' });
  }
};

export const updateEvent = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const eventData: UpdateEventDTO = req.body;
    const updatedEvent = await eventService.updateEvent(
      req.params.id,
      eventData,
    );
    return res.json(updatedEvent);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al actualizar el evento' });
  }
};

export const deleteEvent = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    await eventService.deleteEvent(req.params.id);
    return res.json({ message: 'Evento eliminado (soft delete)' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al eliminar el evento' });
  }
};
