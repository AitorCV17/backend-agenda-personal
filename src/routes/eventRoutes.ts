// src/routes/eventRoutes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = Router();

router.use(authenticateJWT);

router.post('/', [
  body('titulo').notEmpty().withMessage('El título es requerido'),
  body('fecha_inicio').isISO8601().withMessage('Fecha de inicio inválida'),
  body('fecha_fin').isISO8601().withMessage('Fecha de fin inválida'),
], createEvent);

router.get('/', getEvents);

router.put('/:id', [
  body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
], updateEvent);

router.delete('/:id', deleteEvent);

export default router;
