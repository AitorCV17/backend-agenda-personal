import { Request, Response, NextFunction } from 'express';
import * as noteService from '../services/noteService';
import { CustomError } from '../utils/CustomError';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, contenido } = req.body;
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const newNote = await noteService.createNote(userId, titulo, contenido);
    return res.status(201).json(newNote);
  } catch (error) {
    next(new CustomError('Error al crear la nota', 500, 'CREATE_NOTE_ERROR'));
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string; email: string; rol: string } | undefined)?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const notes = await noteService.getNotes(userId);
    return res.json(notes);
  } catch (error) {
    next(new CustomError('Error al obtener las notas', 500, 'GET_NOTES_ERROR'));
  }
};
