import { Router } from 'express';
import { createNote, getNotes } from '../controllers/noteController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createNote));
router.get('/', asyncHandler(getNotes));

export default router;
