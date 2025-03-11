import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, eliminarPerfil } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { validateDTO } from '../middlewares/validation';
import { UpdateUserDTO } from '../dtos/UserDTO';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.get('/me', asyncHandler(obtenerPerfil));
router.put('/me', validateDTO(UpdateUserDTO), asyncHandler(actualizarPerfil));
router.delete('/me', asyncHandler(eliminarPerfil));

export default router;
