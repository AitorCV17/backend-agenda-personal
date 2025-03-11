import { Router } from 'express';
import { createCalendar, getCalendars } from '../controllers/calendarController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createCalendar));
router.get('/', asyncHandler(getCalendars));

export default router;
