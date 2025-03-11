import { Router } from 'express';
import { createNote, getNotes } from '../controllers/noteController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createNote);
router.get('/', authenticateJWT, getNotes);

export default router;
