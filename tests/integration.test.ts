// tests/integration.test.ts
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Pruebas de Integración - API Agenda Personal', () => {
  let userAccessToken: string;
  let adminAccessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Limpiar la base de datos antes de cada prueba
  beforeEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.recordatorio.deleteMany({});
    await prisma.evento.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  test('Registro de usuario (Auth - Register)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Test',
        email: 'user@example.com',
        password: 'password123',
      });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('user@example.com');
  });

  test('Login y Refresh Token (Auth - Login & Refresh)', async () => {
    // Registrar usuario
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Login',
        email: 'login@example.com',
        password: 'password123',
      });

    // Realizar login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('accessToken');
    expect(loginRes.body).toHaveProperty('refreshToken');

    userAccessToken = loginRes.body.accessToken;
    refreshToken = loginRes.body.refreshToken;

    // Probar refresh token
    const refreshRes = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    expect(refreshRes.body).toHaveProperty('refreshToken');
  });

  test('CRUD de eventos (Event Endpoints)', async () => {
    // Registrar y loguear usuario
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Eventos',
        email: 'eventos@example.com',
        password: 'password123',
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'eventos@example.com',
        password: 'password123',
      });
    userAccessToken = loginRes.body.accessToken;

    // Crear evento
    const createRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        titulo: 'Evento de Prueba',
        descripcion: 'Descripción del evento',
        ubicacion: 'Oficina',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 3600000).toISOString(), // +1 hora
      });
    expect(createRes.status).toBe(201);
    const eventId = createRes.body.id;

    // Obtener eventos
    const getRes = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBeGreaterThan(0);

    // Actualizar evento
    const updateRes = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({ titulo: 'Evento Actualizado' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.titulo).toBe('Evento Actualizado');

    // Eliminar evento (soft delete)
    const deleteRes = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/eliminado/);
  });

  test('Perfil de usuario (User Endpoints)', async () => {
    // Registrar y loguear usuario
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Perfil',
        email: 'perfil@example.com',
        password: 'password123',
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'perfil@example.com',
        password: 'password123',
      });
    userAccessToken = loginRes.body.accessToken;

    // Obtener perfil
    const profileRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userAccessToken}`);
    expect(profileRes.status).toBe(200);
    expect(profileRes.body.email).toBe('perfil@example.com');

    // Actualizar perfil
    const updateProfileRes = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send({
        nombre: 'Usuario Perfil Actualizado',
        email: 'perfil_actualizado@example.com',
      });
    expect(updateProfileRes.status).toBe(200);
    expect(updateProfileRes.body.email).toBe('perfil_actualizado@example.com');
    expect(updateProfileRes.body.nombre).toBe('Usuario Perfil Actualizado');
  });

  test('Endpoint de Administrador (Admin Endpoint)', async () => {
    // Registrar usuario con rol ADMIN directamente en la BD
    const adminUser = await prisma.usuario.create({
      data: {
        nombre: 'Admin',
        email: 'admin@example.com',
        password: 'password123', // en un caso real debería estar hasheada
        rol: 'ADMIN',
      },
    });

    // Generar token de admin (para pruebas usamos jwtUtils o similar)
    // Aquí simplificamos: realizar login forzado modificando el payload
    const jwt = require('jsonwebtoken');
    const { config } = require('../src/config');
    adminAccessToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, rol: adminUser.rol },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Acceder al dashboard de admin
    const adminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.message).toMatch(/dashboard de administrador/);
  });
});
