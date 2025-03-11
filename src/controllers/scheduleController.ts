import { Request, Response, NextFunction } from 'express';
import * as scheduleService from '../services/scheduleService';
import { CustomError } from '../utils/CustomError';

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inicio, fin } = req.body;
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const newSchedule = await scheduleService.createSchedule(userId, inicio, fin);
    return res.status(201).json(newSchedule);
  } catch (error) {
    next(new CustomError('Error al crear el horario', 500, 'CREATE_SCHEDULE_ERROR'));
  }
};

export const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const schedules = await scheduleService.getSchedules(userId);
    return res.json(schedules);
  } catch (error) {
    next(new CustomError('Error al obtener los horarios', 500, 'GET_SCHEDULES_ERROR'));
  }
};
