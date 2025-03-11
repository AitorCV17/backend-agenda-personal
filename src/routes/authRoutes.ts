import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateDTO } from '../middlewares/validation';
import { RegisterDTO, LoginDTO } from '../dtos';
import { asyncHandler } from '../utils/asyncHandler';
import { limitadorAutenticacion } from '../middlewares/rateLimitMiddleware';

const router = Router();

// Aplicar rate limiter más estricto a endpoints de autenticación
router.post('/register', limitadorAutenticacion, validateDTO(RegisterDTO), asyncHandler(authController.registrar));
router.post('/login', limitadorAutenticacion, validateDTO(LoginDTO), asyncHandler(authController.iniciarSesion));
router.post('/refresh-token', limitadorAutenticacion, asyncHandler(authController.renovarToken));

// No aplicamos rate limiter al callback de Google OAuth para evitar problemas con el flujo de autenticación
router.get('/google/callback', asyncHandler(authController.autenticarGoogle));

export default router;
