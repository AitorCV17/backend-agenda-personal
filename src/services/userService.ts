import * as userRepository from '../repositories/userRepository';
import { UpdateProfileDTO } from '../types';

export const getProfile = async (userId: string): Promise<any> => {
  return userRepository.findById(userId);
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileDTO,
): Promise<any> => {
  return userRepository.updateUser(userId, {
    nombre: data.nombre,
    email: data.email,
  });
};
