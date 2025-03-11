// src/app.ts (fragmento modificado)
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorMiddleware';
import { initReminderJob } from './jobs/reminderJob';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { metricsMiddleware, metricsEndpoint } from './middlewares/metricsMiddleware';

dotenv.config();

const app = express();

// Configuración de CORS según entorno
const allowedOrigins =
  process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
  })
);

app.use(helmet());
app.use(express.json());
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Middleware para métricas
app.use(metricsMiddleware);

// Endpoint para exponer métricas
app.get('/metrics', metricsEndpoint);

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas principales
app.use('/api', routes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
  initReminderJob();
});

export default app;
