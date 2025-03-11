import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getProfile, updateProfile } from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.get('/me', authenticateJWT, getProfile);

router.put(
  '/me',
  authenticateJWT,
  [
    body('nombre')
      .optional()
      .notEmpty().withMessage('El nombre no puede estar vacío')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    validateRequest,
  ],
  updateProfile,
);

export default router;
