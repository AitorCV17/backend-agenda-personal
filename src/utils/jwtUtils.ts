import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret);
};
