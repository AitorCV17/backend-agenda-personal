import { Router } from 'express';
import { createSchedule, getSchedules, updateSchedule, deleteSchedule } from '../controllers/scheduleController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createSchedule));
router.get('/', asyncHandler(getSchedules));
router.put('/:id', asyncHandler(updateSchedule));
router.delete('/:id', asyncHandler(deleteSchedule));

export default router;
