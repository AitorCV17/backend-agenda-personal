import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { signToken } from '../utils/jwtUtils';
import * as userRepository from '../repositories/userRepository';
import * as refreshTokenRepository from '../repositories/refreshTokenRepository';
import { config } from '../config';
import { RegisterUserDTO, LoginDTO } from '../types';

const REFRESH_TOKEN_EXPIRATION_DAYS = 7;

export const register = async (data: RegisterUserDTO): Promise<any> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await userRepository.createUser({
    nombre: data.nombre,
    email: data.email,
    password: hashedPassword,
  });
  return newUser;
};

export const login = async (data: LoginDTO): Promise<any> => {
  const user = await userRepository.findByEmail(data.email);
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  const accessToken = signToken({
    id: user.id,
    email: user.email,
    rol: user.rol,
  });

  const refreshTokenValue = crypto.randomBytes(64).toString('hex');
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

  await refreshTokenRepository.createRefreshToken({
    usuarioId: user.id,
    token: refreshTokenValue,
    fecha_expiracion: expiration,
  });

  return { accessToken, refreshToken: refreshTokenValue };
};

export const refreshAccessToken = async (
  oldRefreshToken: string,
): Promise<any> => {
  const storedToken = await refreshTokenRepository.findRefreshToken(oldRefreshToken);
  if (!storedToken) throw new Error('Refresh token inválido');

  if (new Date() > storedToken.fecha_expiracion) {
    await refreshTokenRepository.deleteRefreshToken(oldRefreshToken);
    throw new Error('Refresh token expirado');
  }

  const user = await userRepository.findById(storedToken.usuarioId);
  if (!user) throw new Error('Usuario no encontrado');

  await refreshTokenRepository.deleteRefreshToken(oldRefreshToken);

  const accessToken = signToken({
    id: user.id,
    email: user.email,
    rol: user.rol,
  });
  const newRefreshToken = crypto.randomBytes(64).toString('hex');
  const newExpiration = new Date();
  newExpiration.setDate(newExpiration.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

  await refreshTokenRepository.createRefreshToken({
    usuarioId: user.id,
    token: newRefreshToken,
    fecha_expiracion: newExpiration,
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const googleAuthLogin = async (googleToken: string): Promise<any> => {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(config.googleAuth.clientId);
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: config.googleAuth.clientId,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error('Token de Google inválido');

  let user = await userRepository.findByEmail(payload.email);
  if (!user) {
    user = await userRepository.createUser({
      nombre: payload.name || 'Sin nombre',
      email: payload.email,
      password: crypto.randomBytes(32).toString('hex'),
      rol: 'USER',
    });
  }

  const accessToken = signToken({
    id: user.id,
    email: user.email,
    rol: user.rol,
  });
  const refreshTokenValue = crypto.randomBytes(64).toString('hex');
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);

  await refreshTokenRepository.createRefreshToken({
    usuarioId: user.id,
    token: refreshTokenValue,
    fecha_expiracion: expiration,
  });

  return { accessToken, refreshToken: refreshTokenValue };
};
