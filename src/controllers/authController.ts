import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as authService from '../services/authService';
import { RegisterUserDTO, LoginDTO } from '../types';

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user: RegisterUserDTO = req.body;
    const newUser = await authService.register(user);
    return res.status(201).json({ user: newUser });
  } catch (error: any) {
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

export const login = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const credentials: LoginDTO = req.body;
    const tokens = await authService.login(credentials);
    return res.json(tokens);
  } catch (error: any) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
};

export const googleAuthCallback = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const googleToken = req.query.token || req.body.token;
    if (!googleToken) {
      return res
        .status(400)
        .json({ error: 'Token de Google no proporcionado' });
    }
    const tokens = await authService.googleAuthLogin(googleToken as string);
    return res.json(tokens);
  } catch (error: any) {
    return res
      .status(401)
      .json({ error: 'Error en autenticación con Google' });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ error: 'Refresh token no proporcionado' });
    }
    const tokens = await authService.refreshAccessToken(refreshToken);
    return res.json(tokens);
  } catch (error: any) {
    return res
      .status(401)
      .json({ error: 'Refresh token inválido o expirado' });
  }
};
