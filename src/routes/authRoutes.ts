import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, googleAuthCallback, refreshToken } from '../controllers/authController';
import { apiLimiter } from '../middlewares/rateLimitMiddleware';

const router = Router();

router.post(
  '/register',
  apiLimiter,
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register
);

router.post(
  '/login',
  apiLimiter,
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  login
);

router.get('/google/callback', googleAuthCallback);

router.post('/refresh-token', apiLimiter, refreshToken);

export default router;
