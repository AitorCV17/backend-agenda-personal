// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error(`Error: ${err.message}`);
  if (err instanceof CustomError) {
    res.status(err.status).json({
      error: err.message,
      code: err.code,
    });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
