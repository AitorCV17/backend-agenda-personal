import { Request, Response, NextFunction } from 'express';
import * as scheduleService from '../services/scheduleService';
import { CustomError } from '../utils/CustomError';

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inicio, fin } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const newSchedule = await scheduleService.createSchedule(userId, new Date(inicio), new Date(fin));
    return res.status(201).json(newSchedule);
  } catch (error) {
    next(new CustomError('Error al crear el horario', 500, 'CREATE_SCHEDULE_ERROR'));
  }
};

export const getSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const schedules = await scheduleService.getSchedules(userId);
    return res.json(schedules);
  } catch (error) {
    next(new CustomError('Error al obtener los horarios', 500, 'GET_SCHEDULES_ERROR'));
  }
};

export const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inicio, fin } = req.body;
    const scheduleId = req.params.id;
    const updatedSchedule = await scheduleService.updateSchedule(scheduleId, new Date(inicio), new Date(fin));
    return res.json(updatedSchedule);
  } catch (error) {
    next(new CustomError('Error al actualizar el horario', 500, 'UPDATE_SCHEDULE_ERROR'));
  }
};

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scheduleId = req.params.id;
    await scheduleService.deleteSchedule(scheduleId);
    return res.json({ message: 'Horario eliminado (soft delete)' });
  } catch (error) {
    next(new CustomError('Error al eliminar el horario', 500, 'DELETE_SCHEDULE_ERROR'));
  }
};
