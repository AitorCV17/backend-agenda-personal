import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleAuthCallback,
  refreshToken,
} from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { config } from '../config';

const router = Router();

// Registro normal
router.post(
  '/register',
  [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 50 }).withMessage('Debe tener entre 3 y 50 caracteres'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 }).withMessage('Contraseña de mínimo 6 caracteres'),
    validateRequest,
  ],
  register,
);

// Login normal
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
    validateRequest,
  ],
  login,
);

// Inicio del flujo de Google OAuth2
router.get('/google', (req, res) => {
  const googleClientId = config.googleAuth.clientId;
  const redirectUri = config.googleAuth.callbackURL;
  const scope = encodeURIComponent('email profile');
  const responseType = 'code';
  const prompt = 'select_account';

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}`;

  res.redirect(googleAuthUrl);
});

// Callback de Google OAuth2
router.get('/google/callback', googleAuthCallback);

// Refresh token
router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
    validateRequest,
  ],
  refreshToken,
);

export default router;
