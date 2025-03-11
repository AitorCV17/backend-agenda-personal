import * as userRepository from '../repositories/userRepository';
import { UpdateUserDTO } from '../dtos/UserDTO';

export const getProfile = async (userId: string): Promise<any> => {
  return userRepository.findById(userId);
};

export const updateProfile = async (
  userId: string,
  data: UpdateUserDTO,
): Promise<any> => {
  return userRepository.updateUser(userId, {
    nombre: data.nombre,
    email: data.email,
  });
};

export const deleteProfile = async (userId: string): Promise<any> => {
  // Soft delete: actualizar el campo eliminadoEn
  // Se hace un cast a any para permitir actualizar este campo adicional
  return userRepository.updateUser(userId, { eliminadoEn: new Date() } as any);
};
