// src/middlewares/metricsMiddleware.ts
import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Registro para las métricas
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrica personalizada para medir la duración de las solicitudes HTTP
export const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duración de las solicitudes HTTP en milisegundos',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 300, 500, 1000, 2000],
});

// Middleware que mide el tiempo de respuesta
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMs
      .labels(req.method, req.route ? req.route.path : req.path, res.statusCode.toString())
      .observe(duration);
  });
  next();
};

// Endpoint para exponer las métricas
export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
