// src/middlewares/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';

// Límite general de peticiones
export const limitadorAPI = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, inténtalo más tarde.',
});

// Límite más estricto para endpoints de autenticación
export const limitadorAutenticacion = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Demasiadas solicitudes de autenticación, inténtalo más tarde.',
});
