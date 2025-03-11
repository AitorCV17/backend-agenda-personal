import * as userRepository from '../repositories/userRepository';
import { UpdateUserDTO } from '../dtos/UserDTO';

export const obtenerPerfil = async (idUsuario: string): Promise<any> => {
  return userRepository.buscarPorId(idUsuario);
};

export const actualizarPerfil = async (
  idUsuario: string,
  datos: UpdateUserDTO,
): Promise<any> => {
  return userRepository.actualizarUsuario(idUsuario, {
    nombre: datos.nombre,
    email: datos.email,
  });
};

export const eliminarPerfil = async (idUsuario: string): Promise<any> => {
  // Soft delete: actualizar el campo eliminadoEn
  // Se hace un cast a any para permitir actualizar este campo adicional
  return userRepository.actualizarUsuario(idUsuario, { eliminadoEn: new Date() } as any);
};
