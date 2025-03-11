import jwt, { Secret, SignOptions, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { config } from '../config';

interface JWTCustomPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh';
  [key: string]: any;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'JWTError';
  }
}

const obtenerValorDeExpiracion = (expiracion: string | number): number => {
  if (typeof expiracion === 'number') {
    return Math.floor(expiracion);
  }

  // Convertir cadenas como '1h', '7d' a segundos
  const unidad = expiracion.slice(-1);
  const valor = parseInt(expiracion.slice(0, -1));

  switch (unidad) {
    case 'h':
      return valor * 60 * 60;
    case 'd':
      return valor * 24 * 60 * 60;
    case 'm':
      return valor * 60;
    case 's':
      return valor;
    default:
      throw new JWTError(`Formato de expiración inválido: ${expiracion}`);
  }
};

const crearToken = (
  payload: JWTCustomPayload,
  secreto: string,
  expiracion: string | number,
  tipo: 'access' | 'refresh'
): string => {
  if (!payload.userId || !payload.email) {
    throw new JWTError('El payload es inválido: userId y email son requeridos');
  }

  const opciones: SignOptions = {
    expiresIn: obtenerValorDeExpiracion(expiracion),
    algorithm: 'HS256',
    issuer: 'agenda-personal-backend',
    audience: config.frontendUrl,
    notBefore: '0s',
  };

  if (!secreto || secreto.length < 32) {
    throw new JWTError(`JWT_${tipo.toUpperCase()}_SECRET no está configurado correctamente o es demasiado débil`);
  }

  return jwt.sign({ ...payload, type: tipo }, secreto as Secret, opciones);
};

export const firmarParDeTokens = (payload: JWTCustomPayload): TokenPair => {
  try {
    const accessToken = crearToken(
      payload,
      config.jwtSecret,
      config.jwtExpiration,
      'access'
    );

    const refreshToken = crearToken(
      payload,
      config.jwtRefreshSecret,
      config.jwtRefreshExpiration,
      'refresh'
    );

    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof JWTError) {
      throw error;
    }
    throw new JWTError('Error al generar el par de tokens', error as Error);
  }
};

export const verificarToken = (token: string, tipo: 'access' | 'refresh' = 'access'): JWTCustomPayload => {
  try {
    if (!token) {
      throw new JWTError('El token es requerido');
    }

    const secreto = tipo === 'access' ? config.jwtSecret : config.jwtRefreshSecret;
    if (!secreto) {
      throw new JWTError(`JWT_${tipo.toUpperCase()}_SECRET no está configurado`);
    }

    const decodificado = jwt.verify(token, secreto as Secret, {
      algorithms: ['HS256'],
      issuer: 'agenda-personal-backend',
      audience: config.frontendUrl,
    }) as JWTCustomPayload;

    // Validación adicional del payload
    if (!decodificado.userId || !decodificado.email) {
      throw new JWTError('El payload del token es inválido');
    }

    // Verificar que el tipo de token coincida
    if (decodificado.type !== tipo) {
      throw new JWTError(`Tipo de token inválido: se esperaba un token de tipo ${tipo}`);
    }

    return decodificado;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new JWTError(`El token de tipo ${tipo} ha expirado`);
    }
    if (error instanceof JsonWebTokenError) {
      throw new JWTError(`El token de tipo ${tipo} es inválido`);
    }
    if (error instanceof JWTError) {
      throw error;
    }
    throw new JWTError(`Error al verificar el token de tipo ${tipo}`, error as Error);
  }
};

export const refrescarTokens = (refreshToken: string): TokenPair => {
  try {
    const decodificado = verificarToken(refreshToken, 'refresh');
    const { userId, email } = decodificado;

    // Generar un nuevo par de tokens
    return firmarParDeTokens({ userId, email });
  } catch (error) {
    throw new JWTError('Error al refrescar los tokens', error as Error);
  }
};
