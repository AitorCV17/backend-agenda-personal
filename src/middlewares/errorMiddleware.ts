import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log detallado sin exponer datos sensibles al cliente
  logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path });
  if (err instanceof CustomError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
    });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
