import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.use(authenticateJWT);

router.post(
  '/',
  [
    body('titulo')
      .notEmpty().withMessage('El título es requerido')
      .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser un texto')
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('ubicacion')
      .optional()
      .isString().withMessage('La ubicación debe ser un texto')
      .isLength({ max: 100 }).withMessage('La ubicación no puede exceder 100 caracteres'),
    body('fecha_inicio')
      .notEmpty().withMessage('La fecha de inicio es requerida')
      .isISO8601().withMessage('Fecha de inicio inválida'),
    body('fecha_fin')
      .notEmpty().withMessage('La fecha de fin es requerida')
      .isISO8601().withMessage('Fecha de fin inválida'),
    validateRequest,
  ],
  createEvent,
);

router.get('/', getEvents);

router.put(
  '/:id',
  [
    body('titulo')
      .optional()
      .notEmpty().withMessage('El título no puede estar vacío')
      .isLength({ min: 3, max: 100 }).withMessage('El título debe tener entre 3 y 100 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser un texto')
      .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
    body('ubicacion')
      .optional()
      .isString().withMessage('La ubicación debe ser un texto')
      .isLength({ max: 100 }).withMessage('La ubicación no puede exceder 100 caracteres'),
    body('fecha_inicio')
      .optional()
      .isISO8601().withMessage('Fecha de inicio inválida'),
    body('fecha_fin')
      .optional()
      .isISO8601().withMessage('Fecha de fin inválida'),
    validateRequest,
  ],
  updateEvent,
);

router.delete('/:id', deleteEvent);

export default router;
