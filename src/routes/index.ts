import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import eventRoutes from './eventRoutes';
import calendarRoutes from './calendarRoutes';  // Ruta para calendarios
import noteRoutes from './noteRoutes';          // Ruta para notas
import scheduleRoutes from './scheduleRoutes';  // Ruta para horarios
import adminRoutes from './adminRoutes';

const router = Router();

// Rutas de autenticación no protegidas
router.use('/auth', authRoutes);  // Ruta pública para login y registro

// Rutas protegidas con autenticación
router.use('/users', userRoutes);  // Acceso a perfil de usuario
router.use('/events', eventRoutes);  // Acceso a eventos de usuario
router.use('/calendars', calendarRoutes);  // Acceso a calendarios del usuario
router.use('/notes', noteRoutes);  // Acceso a las notas del usuario
router.use('/schedules', scheduleRoutes);  // Acceso a los horarios del usuario

// Rutas de administración (si aplica)
router.use('/admin', adminRoutes);  // Rutas protegidas para administradores

export default router;
