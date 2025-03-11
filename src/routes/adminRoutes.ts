import { Router, Request, Response, NextFunction } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    authenticateJWT(req, res, (err) => {
        if (err) return next(err);
        authorizeRole('ADMIN')(req, res, next);
    });
});

router.get('/dashboard', (req: Request, res: Response) => {
    res.json({ message: 'Bienvenido al dashboard de administrador' });
});

export default router;
