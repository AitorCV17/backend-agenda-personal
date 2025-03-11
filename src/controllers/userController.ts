import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { CustomError } from '../utils/CustomError';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const user = await userService.getProfile(userId);
    return res.json(user);
  } catch (error) {
    next(new CustomError('Error al obtener el perfil', 500, 'GET_PROFILE_ERROR'));
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileData = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const updatedUser = await userService.updateProfile(userId, profileData);
    return res.json(updatedUser);
  } catch (error) {
    next(new CustomError('Error al actualizar el perfil', 500, 'UPDATE_PROFILE_ERROR'));
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    await userService.deleteProfile(userId);
    return res.json({ message: 'Cuenta de usuario desactivada (soft delete)' });
  } catch (error) {
    next(new CustomError('Error al eliminar la cuenta', 500, 'DELETE_PROFILE_ERROR'));
  }
};
