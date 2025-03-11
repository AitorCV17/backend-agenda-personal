import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as userService from '../services/userService';
import { UpdateProfileDTO } from '../types';
import { CustomError } from '../utils/CustomError';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const user = await userService.getProfile(req.user?.id);
    return res.json(user);
  } catch (error: any) {
    next(new CustomError('Error al obtener el perfil', 500, 'GET_PROFILE_ERROR'));
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const profileData: UpdateProfileDTO = req.body;
    const updatedUser = await userService.updateProfile(req.user?.id, profileData);
    return res.json(updatedUser);
  } catch (error: any) {
    next(new CustomError('Error al actualizar el perfil', 500, 'UPDATE_PROFILE_ERROR'));
  }
};
