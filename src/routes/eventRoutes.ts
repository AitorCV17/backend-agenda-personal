import { Router } from 'express';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import { validateDTO } from '../middlewares/validation';
import { CreateEventDTO, UpdateEventDTO } from '../dtos/EventDTO';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Especificamos la ruta base para el middleware
router.use('/', authenticateJWT);

router.post(
  '/',
  validateDTO(CreateEventDTO),
  createEvent
);

router.get(
  '/',
  getEvents
);

router.put(
  '/:id',
  validateDTO(UpdateEventDTO),
  updateEvent
);

router.delete(
  '/:id',
  deleteEvent
);

export default router;
