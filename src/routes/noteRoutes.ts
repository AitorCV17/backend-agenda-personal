import { Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/noteController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', asyncHandler(createNote));
router.get('/', asyncHandler(getNotes));
router.put('/:id', asyncHandler(updateNote));
router.delete('/:id', asyncHandler(deleteNote));

export default router;
