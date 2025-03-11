import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { validateDTO } from '../middlewares/validation';
import { UpdateUserDTO } from '../dtos/UserDTO';

const router = Router();

router.get('/me', authenticateJWT, getProfile);
router.put(
  '/me',
  authenticateJWT,
  validateDTO(UpdateUserDTO),
  updateProfile
);

export default router;
