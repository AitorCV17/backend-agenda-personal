import { Router } from 'express';
import { createCalendar, getCalendars, updateCalendar, deleteCalendar } from '../controllers/calendarController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createCalendar));
router.get('/', asyncHandler(getCalendars));
router.put('/:id', asyncHandler(updateCalendar));
router.delete('/:id', asyncHandler(deleteCalendar));

export default router;
