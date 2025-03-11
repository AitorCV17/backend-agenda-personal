import { Router } from 'express';
import { createSchedule, getSchedules } from '../controllers/scheduleController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createSchedule));
router.get('/', asyncHandler(getSchedules));

export default router;
