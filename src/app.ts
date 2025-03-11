import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import routes from './routes';
import { errorHandler } from './middlewares/errorMiddleware';
import { metricsMiddleware, metricsEndpoint } from './middlewares/metricsMiddleware';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
/// <reference path="./types/express/index.d.ts" />

dotenv.config();

const app = express();

// Configuración de CORS
const allowedOrigins =
  process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
  }),
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Protección CSRF opcional
if (process.env.USE_CSRF === 'true') {
  app.use(csurf({ cookie: true }));

}

app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Middleware de métricas
app.use(metricsMiddleware);
app.get('/metrics', metricsEndpoint);

// Configuración de documentación Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Agenda Personal API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts', './src/dtos/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/api', routes);

// Middleware global de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
