// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/authService';
import { RegisterUserDTO, LoginDTO } from '../types';
import { CustomError } from '../utils/CustomError';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user: RegisterUserDTO = req.body;
    const newUser = await authService.register(user);
    return res.status(201).json({ user: newUser });
  } catch (error: any) {
    next(new CustomError('Error al registrar el usuario', 500, 'REGISTER_ERROR'));
  }
};

// Se deben aplicar cambios similares en los demás controladores.
