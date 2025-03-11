import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // Forzamos el tipo para que se ajuste al objeto esperado
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; rol: string };
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  } else {
    res.status(401).json({ error: 'No se proporcionó token de autenticación' });
  }
};
