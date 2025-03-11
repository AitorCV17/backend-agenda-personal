// src/controllers/userController.ts

/// <reference path="../types/express/index.d.ts" />

import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { CustomError } from '../utils/CustomError';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ahora el compilador reconoce req.user gracias a la declaración de tipos
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
