import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleAuthCallback,
  refreshToken,
} from '../controllers/authController';

const router = Router();

router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('El email es inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('El email es inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
], login);

router.get('/google/callback', googleAuthCallback);

router.post('/refresh-token', refreshToken);

export default router;
