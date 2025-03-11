import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Rol } from '@prisma/client';

interface JWTCustomPayload {
  id: string;
  email: string;
  rol: Rol;
}

export class JWTError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'JWTError';
  }
}

export const firmarToken = (payload: JWTCustomPayload): string => {
  if (!payload.id || !payload.email) {
    throw new JWTError('El payload es inválido: id y email son requeridos');
  }

  try {
    // Convertimos el tiempo de expiración a número de segundos si es una cadena
    const tiempoExpiracion = typeof config.jwtExpiration === 'string'
      ? Math.floor(Date.now() / 1000) + parseInt(config.jwtExpiration)
      : config.jwtExpiration;

    return jwt.sign(
      payload,
      String(config.jwtSecret),
      { expiresIn: tiempoExpiracion }
    );
  } catch (error) {
    throw new JWTError('Error al firmar el token', error as Error);
  }
};

export const verificarToken = (token: string): JWTCustomPayload => {
  try {
    const decodificado = jwt.verify(token, String(config.jwtSecret)) as JWTCustomPayload;
    
    if (!decodificado.id || !decodificado.email) {
      throw new JWTError('Token inválido');
    }

    return decodificado;
  } catch (error) {
    throw new JWTError(`Error al verificar el token: ${(error as Error).message}`);
  }
};
