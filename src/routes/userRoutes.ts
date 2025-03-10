import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getProfile, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/me', authenticateJWT, getProfile);

router.put(
  '/me',
  authenticateJWT,
  [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('Email inválido'),
  ],
  updateProfile
);

export default router;
