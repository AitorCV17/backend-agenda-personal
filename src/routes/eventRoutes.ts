import { Router } from 'express';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import { validateDTO } from '../middlewares/validation';
import { CreateEventDTO, UpdateEventDTO } from '../dtos/EventDTO';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateDTO(CreateEventDTO), asyncHandler(createEvent));
router.get('/', asyncHandler(getEvents));
router.put('/:id', validateDTO(UpdateEventDTO), asyncHandler(updateEvent));
router.delete('/:id', asyncHandler(deleteEvent));

export default router;
