import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, googleAuthCallback, refreshToken } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';

const router = Router();

router.post(
  '/register',
  [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email').isEmail().withMessage('El email es inválido'),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateRequest,
  ],
  register,
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('El email es inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    validateRequest,
  ],
  login,
);

router.get('/google/callback', googleAuthCallback);

router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token no proporcionado'),
    validateRequest,
  ],
  refreshToken,
);

export default router;
