// src/routes/adminRoutes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = Router();

// Requiere autenticación y rol ADMIN
router.use(authenticateJWT, authorizeRole('ADMIN'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Bienvenido al dashboard de administrador' });
});

export default router;
