import { Request, Response, NextFunction } from 'express';
import * as calendarService from '../services/calendarService';
import { CustomError } from '../utils/CustomError';

export const createCalendar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo } = req.body;
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const newCalendar = await calendarService.createCalendar(userId, titulo);
    return res.status(201).json(newCalendar);
  } catch (error) {
    next(new CustomError('Error al crear el calendario', 500, 'CREATE_CALENDAR_ERROR'));
  }
};

export const getCalendars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const calendars = await calendarService.getCalendars(userId);
    return res.json(calendars);
  } catch (error) {
    next(new CustomError('Error al obtener los calendarios', 500, 'GET_CALENDARS_ERROR'));
  }
};
