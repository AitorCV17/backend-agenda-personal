import { Router } from 'express';
import { createCalendar, getCalendars } from '../controllers/calendarController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

// Se agrega el path base '/' en cada use para evitar errores de tipo.
router.post('/', authenticateJWT, createCalendar);
router.get('/', authenticateJWT, getCalendars);

export default router;
