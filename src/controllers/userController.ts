import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as userService from '../services/userService';
import { UpdateProfileDTO } from '../types';

export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const user = await userService.getProfile(req.user?.id);
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const profileData: UpdateProfileDTO = req.body;
    const updatedUser = await userService.updateProfile(
      req.user?.id,
      profileData,
    );
    return res.json(updatedUser);
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};
