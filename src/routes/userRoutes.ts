import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { validateDTO } from '../middlewares/validation';
import { UpdateUserDTO } from '../dtos/UserDTO';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.get('/me', asyncHandler(getProfile));
router.put('/me', validateDTO(UpdateUserDTO), asyncHandler(updateProfile));

export default router;
