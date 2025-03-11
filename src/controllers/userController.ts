import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { CustomError } from '../utils/CustomError';

export const obtenerPerfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) return res.status(400).json({ error: 'Usuario no autenticado' });
    const usuario = await userService.obtenerPerfil(idUsuario);
    return res.json(usuario);
  } catch (error) {
    next(new CustomError('Error al obtener el perfil', 500, 'GET_PROFILE_ERROR'));
  }
};

export const actualizarPerfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const datosPerfil = req.body;
    const idUsuario = req.user?.id;
    if (!idUsuario) return res.status(400).json({ error: 'Usuario no autenticado' });
    const usuarioActualizado = await userService.actualizarPerfil(idUsuario, datosPerfil);
    return res.json(usuarioActualizado);
  } catch (error) {
    next(new CustomError('Error al actualizar el perfil', 500, 'UPDATE_PROFILE_ERROR'));
  }
};

export const eliminarPerfil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idUsuario = req.user?.id;
    if (!idUsuario) return res.status(400).json({ error: 'Usuario no autenticado' });
    await userService.eliminarPerfil(idUsuario);
    return res.json({ message: 'Cuenta de usuario desactivada (soft delete)' });
  } catch (error) {
    next(new CustomError('Error al eliminar la cuenta', 500, 'DELETE_PROFILE_ERROR'));
  }
};
