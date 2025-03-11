import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { CustomError } from '../utils/CustomError';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password } = req.body;
    await authService.register({ nombre, email, password });
    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error: any) {
    next(new CustomError('Error al registrar el usuario', 500, 'REGISTER_ERROR'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login({ email, password });
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Credenciales inválidas', 401, 'LOGIN_ERROR'));
  }
};

export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: 'No se recibió el parámetro "code" de Google' });
    }
    const client = new OAuth2Client(
      config.googleAuth.clientId,
      config.googleAuth.clientSecret,
      config.googleAuth.callbackURL,
    );
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
      return res.status(400).json({ error: 'No se obtuvo id_token de Google' });
    }
    const finalTokens = await authService.googleAuthLogin(tokens.id_token);
    const frontendCallbackUrl = `${config.frontendUrl}/auth/callback?accessToken=${finalTokens.accessToken}&refreshToken=${finalTokens.refreshToken}`;
    return res.redirect(frontendCallbackUrl);
  } catch (error: any) {
    next(new CustomError('Error en autenticación con Google: ' + error.message, 401, 'GOOGLE_AUTH_ERROR'));
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Refresh token inválido o expirado', 401, 'REFRESH_TOKEN_ERROR'));
  }
};
