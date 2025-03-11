import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateDTO } from '../middlewares/validation';
import { RegisterDTO, LoginDTO } from '../dtos';
import { config } from '../config';

const router = Router();

router.post('/register', validateDTO(RegisterDTO), authController.register);

router.post('/login', validateDTO(LoginDTO), authController.login);

// Flujo de autenticación con Google OAuth2
router.get('/google', (req, res) => {
  const googleClientId = config.googleAuth.clientId;
  const redirectUri = config.googleAuth.callbackURL;
  const scope = encodeURIComponent('email profile');
  const responseType = 'code';
  const prompt = 'select_account';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}`;
  res.redirect(googleAuthUrl);
});

router.get('/google/callback', authController.googleAuthCallback);

// Endpoint para refresh token
router.post(
  '/refresh-token',
  (req, res, next) => {
    if (!req.body.refreshToken) {
      return res.status(400).json({ message: 'Refresh token requerido' });
    }
    next();
  },
  authController.refreshToken,
);

export default router;
