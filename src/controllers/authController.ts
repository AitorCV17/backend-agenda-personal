import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { CustomError } from '../utils/CustomError';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password } = req.body;
    await authService.registrar({ nombre, email, password });
    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error: any) {
    next(new CustomError('Error al registrar el usuario', 500, 'REGISTER_ERROR'));
  }
};

export const iniciarSesion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.iniciarSesion({ email, password });
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Credenciales inválidas', 401, 'LOGIN_ERROR'));
  }
};

export const autenticarGoogle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const codigo = req.query.code as string;
    if (!codigo) {
      return res.status(400).json({ error: 'No se recibió el parámetro "code" de Google' });
    }
    const cliente = new OAuth2Client(
      config.googleAuth.clientId,
      config.googleAuth.clientSecret,
      config.googleAuth.callbackURL,
    );
    const { tokens } = await cliente.getToken(codigo);
    if (!tokens.id_token) {
      return res.status(400).json({ error: 'No se obtuvo id_token de Google' });
    }
    const tokensFinales = await authService.autenticarGoogle(tokens.id_token);
    const urlCallback = `${config.frontendUrl}/auth/callback?accessToken=${tokensFinales.accessToken}&refreshToken=${tokensFinales.refreshToken}`;
    return res.redirect(urlCallback);
  } catch (error: any) {
    next(new CustomError('Error en autenticación con Google: ' + error.message, 401, 'GOOGLE_AUTH_ERROR'));
  }
};

export const renovarToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.renovarToken(refreshToken);
    return res.json(tokens);
  } catch (error: any) {
    next(new CustomError('Refresh token inválido o expirado', 401, 'REFRESH_TOKEN_ERROR'));
  }
};
