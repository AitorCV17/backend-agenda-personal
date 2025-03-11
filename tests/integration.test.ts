// tests/integration.test.ts
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Pruebas de Integración', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.recordatorio.deleteMany({});
    await prisma.evento.deleteMany({});
    await prisma.usuario.deleteMany({});
  });

  test('Registro de usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Test',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('Login y Refresh Token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Login',
        email: 'login@example.com',
        password: 'password123',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('accessToken');
    expect(loginRes.body).toHaveProperty('refreshToken');

    accessToken = loginRes.body.accessToken;
    refreshToken = loginRes.body.refreshToken;

    const refreshRes = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body).toHaveProperty('accessToken');
    expect(refreshRes.body).toHaveProperty('refreshToken');
  });

  test('CRUD de eventos', async () => {
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

    accessToken = loginRes.body.accessToken;

    const createRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo: 'Evento de Prueba',
        descripcion: 'Descripción del evento',
        ubicacion: 'Oficina',
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 3600000).toISOString(), // +1 hora
      });

    expect(createRes.status).toBe(201);

    const eventId = createRes.body.id;

    const getRes = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBeGreaterThan(0);

    const updateRes = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ titulo: 'Evento Actualizado' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.titulo).toBe('Evento Actualizado');

    const deleteRes = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toMatch(/eliminado/);
  });

  test('Recordatorio por correo (Job)', async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Usuario Recordatorio',
        email: 'reminder@example.com',
        password: 'password123',
      });

    const user = userRes.body.user;

    const event = await prisma.evento.create({
      data: {
        titulo: 'Evento Recordatorio',
        descripcion: 'Recordatorio de prueba',
        ubicacion: 'Lugar',
        fecha_inicio: new Date(Date.now() + 7200000), // +2 horas
        fecha_fin: new Date(Date.now() + 10800000), // +3 horas
        organizadorId: user.id,
      },
    });

    const reminder = await prisma.recordatorio.create({
      data: {
        eventoId: event.id,
        usuarioId: user.id,
        enviado: false,
      },
    });

    const { sendReminderEmails } = require('../src/jobs/reminderJob');
    await sendReminderEmails();

    const updatedReminder = await prisma.recordatorio.findUnique({
      where: { id: reminder.id },
    });

    expect(updatedReminder?.enviado).toBe(true);
  });
});
