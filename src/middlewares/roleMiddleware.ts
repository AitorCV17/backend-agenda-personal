// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { logger } from '../utils/logger';

// Verifica que el usuario autenticado tenga el rol requerido
export const authorizeRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Acceso denegado: usuario no autenticado.');
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (req.user.rol !== requiredRole) {
      logger.warn(`Acceso denegado: se requiere rol ${requiredRole}`);
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    next();
  };
};
