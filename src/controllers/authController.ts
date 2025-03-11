import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { RegisterUserDTO, LoginDTO } from '../types';
import { CustomError } from '../utils/CustomError';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

// Registro de usuario
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

// Login de usuario
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

// Callback de Google OAuth
export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).json({ error: 'No se recibió el parámetro "code" de Google' });
    }

    const client = new OAuth2Client(
      config.googleAuth.clientId,
      config.googleAuth.clientSecret,
      config.googleAuth.callbackURL
    );

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({ error: 'No se obtuvo id_token de Google' });
    }

    const finalTokens = await authService.googleAuthLogin(tokens.id_token);

    const frontendCallbackUrl = `${config.frontendUrl}/auth/callback?accessToken=${finalTokens.accessToken}&refreshToken=${finalTokens.refreshToken}`;

    console.log('[GoogleAuthCallback] Redirigiendo a:', frontendCallbackUrl);

    return res.redirect(frontendCallbackUrl);
  } catch (error: any) {
    next(
      new CustomError(
        'Error en autenticación con Google: ' + error.message,
        401,
        'GOOGLE_AUTH_ERROR'
      )
    );
  }
};

// Refresh Token
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
