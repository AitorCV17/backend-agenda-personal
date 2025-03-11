import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const authorizeRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Acceso denegado: usuario no autenticado.', { path: req.path });
      return res.status(401).json({ error: 'No autenticado' });
    }
    const userRole = (req.user as any).rol;
    if (userRole !== requiredRole) {
      logger.warn(`Acceso denegado: se requiere rol ${requiredRole}`, { userRole, path: req.path });
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    next();
  };
};
