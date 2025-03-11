import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = Router();

// Se especifica la ruta base '/' para que la llamada a use sea válida.
router.use('/', authenticateJWT, authorizeRole('ADMIN'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Bienvenido al dashboard de administrador' });
});

export default router;
