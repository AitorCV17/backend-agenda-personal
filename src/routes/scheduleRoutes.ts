import { Router } from 'express';
import { createSchedule, getSchedules } from '../controllers/scheduleController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createSchedule);
router.get('/', authenticateJWT, getSchedules);

export default router;
