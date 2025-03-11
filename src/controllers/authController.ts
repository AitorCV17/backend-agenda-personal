import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterUserDTO, LoginDTO } from '../types';
import { CustomError } from '../utils/CustomError';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const user: RegisterUserDTO = req.body;
    const newUser = await authService.register(user);
    return res.status(201).json({ user: newUser });
  } catch (error: any) {
    next(new CustomError('Error al registrar el usuario', 500, 'REGISTER_ERROR'));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const credentials: LoginDTO = req.body;
    const tokens = await authService.login(credentials);
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Credenciales inválidas', 401, 'LOGIN_ERROR'));
  }
};

export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const googleToken = req.query.token || req.body.token;
    if (!googleToken) {
      return res.status(400).json({ error: 'Token de Google no proporcionado' });
    }
    const tokens = await authService.googleAuthLogin(googleToken as string);
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Error en autenticación con Google', 401, 'GOOGLE_AUTH_ERROR'));
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Refresh token inválido o expirado', 401, 'REFRESH_TOKEN_ERROR'));
  }
};
