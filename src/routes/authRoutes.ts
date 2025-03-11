import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateDTO } from '../middlewares/validation';
import { RegisterDTO, LoginDTO } from '../dtos';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/register', validateDTO(RegisterDTO), asyncHandler(authController.register));
router.post('/login', validateDTO(LoginDTO), asyncHandler(authController.login));

router.get('/google/callback', asyncHandler(authController.googleAuthCallback));
router.post('/refresh-token', asyncHandler(authController.refreshToken));

export default router;
