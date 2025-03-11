import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { firmarToken } from '../utils/jwtUtils';
import * as userRepository from '../repositories/userRepository';
import * as refreshTokenRepository from '../repositories/refreshTokenRepository';
import { config } from '../config';
import { Rol } from '@prisma/client';

const DIAS_EXPIRACION_REFRESH_TOKEN = 7;

export const registrar = async (datos: { nombre: string; email: string; password: string; rol?: Rol }) => {
  const passwordEncriptado = await bcrypt.hash(datos.password, 10);
  // Se asigna el rol "USUARIO" por defecto
  const nuevoUsuario = await userRepository.crearUsuario({
    nombre: datos.nombre,
    email: datos.email,
    password: passwordEncriptado,
    rol: datos.rol || ("USUARIO" as Rol),
  });
  return nuevoUsuario;
};

export const iniciarSesion = async (datos: { email: string; password: string }) => {
  const usuario = await userRepository.buscarPorEmail(datos.email);
  if (!usuario) throw new Error('Usuario no encontrado');
  const coincidePassword = await bcrypt.compare(datos.password, usuario.password);
  if (!coincidePassword) throw new Error('Contraseña incorrecta');
  const accessToken = firmarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
  });
  const valorRefreshToken = crypto.randomBytes(64).toString('hex');
  const fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + DIAS_EXPIRACION_REFRESH_TOKEN);
  await refreshTokenRepository.crearRefreshToken({
    usuarioId: usuario.id,
    token: valorRefreshToken,
    fecha_expiracion: fechaExpiracion,
  });
  return { accessToken, refreshToken: valorRefreshToken };
};

export const renovarToken = async (refreshTokenAntiguo: string) => {
  const tokenAlmacenado = await refreshTokenRepository.buscarRefreshToken(refreshTokenAntiguo);
  if (!tokenAlmacenado) throw new Error('Refresh token inválido');
  if (new Date() > tokenAlmacenado.fecha_expiracion) {
    await refreshTokenRepository.eliminarRefreshToken(refreshTokenAntiguo);
    throw new Error('Refresh token expirado');
  }
  const usuario = await userRepository.buscarPorId(tokenAlmacenado.usuarioId);
  if (!usuario) throw new Error('Usuario no encontrado');
  await refreshTokenRepository.eliminarRefreshToken(refreshTokenAntiguo);
  const accessToken = firmarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
  });
  const nuevoRefreshToken = crypto.randomBytes(64).toString('hex');
  const nuevaExpiracion = new Date();
  nuevaExpiracion.setDate(nuevaExpiracion.getDate() + DIAS_EXPIRACION_REFRESH_TOKEN);
  await refreshTokenRepository.crearRefreshToken({
    usuarioId: usuario.id,
    token: nuevoRefreshToken,
    fecha_expiracion: nuevaExpiracion,
  });
  return { accessToken, refreshToken: nuevoRefreshToken };
};

export const autenticarGoogle = async (googleToken: string) => {
  const { OAuth2Client } = await import('google-auth-library');
  const cliente = new OAuth2Client(config.googleAuth.clientId);
  const ticket = await cliente.verifyIdToken({
    idToken: googleToken,
    audience: config.googleAuth.clientId,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error('Token de Google inválido');
  let usuario = await userRepository.buscarPorEmail(payload.email);
  if (!usuario) {
    // Registrar nuevo usuario con rol "USUARIO" por defecto
    usuario = await registrar({
      nombre: payload.name || '',
      email: payload.email,
      password: crypto.randomBytes(16).toString('hex'),
      rol: "USUARIO" as Rol,
    });
  }
  const accessToken = firmarToken({
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
  });
  const valorRefreshToken = crypto.randomBytes(64).toString('hex');
  const fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + DIAS_EXPIRACION_REFRESH_TOKEN);
  await refreshTokenRepository.crearRefreshToken({
    usuarioId: usuario.id,
    token: valorRefreshToken,
    fecha_expiracion: fechaExpiracion,
  });
  return { accessToken, refreshToken: valorRefreshToken };
};

export const obtenerPerfil = async (idUsuario: string) => {
  const usuario = await userRepository.buscarPorId(idUsuario);
  if (!usuario) throw new Error('Usuario no encontrado');
  return usuario;
};
