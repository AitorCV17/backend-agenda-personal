import request from 'supertest';
import app from '../app';
import { prisma } from '../config/prisma';

describe('Endpoints de Autenticación', () => {
  beforeAll(async () => {
    // Configurar la base de datos de test o iniciar una transacción
  });

  afterAll(async () => {
    // Limpiar la base de datos de test
    await prisma.$disconnect();
  });

  it('debería registrar un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Test',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado exitosamente');
  });

  it('debería iniciar sesión con un usuario existente', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
