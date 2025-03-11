import { Request, Response, NextFunction } from 'express';
import * as noteService from '../services/noteService';
import { CustomError } from '../utils/CustomError';

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, contenido } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const newNote = await noteService.createNote(userId, titulo, contenido);
    return res.status(201).json(newNote);
  } catch (error) {
    next(new CustomError('Error al crear la nota', 500, 'CREATE_NOTE_ERROR'));
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Usuario no autenticado' });
    const notes = await noteService.getNotes(userId);
    return res.json(notes);
  } catch (error) {
    next(new CustomError('Error al obtener las notas', 500, 'GET_NOTES_ERROR'));
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { titulo, contenido } = req.body;
    const noteId = req.params.id;
    const updatedNote = await noteService.updateNote(noteId, titulo, contenido);
    return res.json(updatedNote);
  } catch (error) {
    next(new CustomError('Error al actualizar la nota', 500, 'UPDATE_NOTE_ERROR'));
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    await noteService.deleteNote(noteId);
    return res.json({ message: 'Nota eliminada (soft delete)' });
  } catch (error) {
    next(new CustomError('Error al eliminar la nota', 500, 'DELETE_NOTE_ERROR'));
  }
};
