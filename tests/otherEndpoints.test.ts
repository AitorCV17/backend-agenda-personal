import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';
import { sendReminderEmails } from '../src/jobs/reminderJob';

describe('Pruebas de otros endpoints y funcionalidades', () => {
  let userAccessToken: string;
  let eventId: string;

  const testUser = {
    nombre: 'Usuario Participante',
    email: 'participante@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    // Limpiar usuario si existe
    await prisma.usuario.deleteMany({ where: { email: testUser.email } });
    // Registrar usuario y obtener token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    expect(loginRes.status).toBe(200);
    userAccessToken = loginRes.body.accessToken;

    // Crear un evento para pruebas (el usuario es el organizador)
    const eventData = {
      titulo: 'Evento para Participantes',
      descripcion: 'Evento de prueba para participantes',
      ubicacion: 'Sala de reuniones',
      fechaInicio: new Date(Date.now() + 3600000).toISOString(),
      fechaFin: new Date(Date.now() + 7200000).toISOString(),
    };
    const eventRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${userAccessToken}`)
      .send(eventData);
    expect(eventRes.status).toBe(201);
    eventId = eventRes.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Participante de Evento', () => {
    it('Se puede agregar un participante a un evento (usando repositorio o servicio)', async () => {
      // Dado que no existe un endpoint dedicado para agregar participantes,
      // simulamos la inserción directa en la tabla "ParticipanteEvento".
      const participante = await prisma.participanteEvento.create({
        data: {
          eventoId: eventId,
          usuarioId: (await prisma.usuario.findUnique({ where: { email: testUser.email } }))!.id,
          // Se asigna estado PENDIENTE por defecto
        },
      });
      expect(participante).toHaveProperty('id');
      expect(participante.estadoAsistencia).toBe('PENDIENTE');
    });
  });

  describe('Recordatorio', () => {
    it('El job de recordatorios actualiza el campo "enviado" al enviar el recordatorio', async () => {
      // Crear un recordatorio pendiente para el evento creado
      const reminder = await prisma.recordatorio.create({
        data: {
          eventoId: eventId,
          usuarioId: (await prisma.usuario.findUnique({ where: { email: testUser.email } }))!.id,
          enviado: false,
        },
      });
      // Ejecutar el job (en un entorno de test, se recomienda usar un mock de nodemailer,
      // pero aquí comprobamos que tras la ejecución se actualice el flag "enviado").
      await sendReminderEmails();
      const updatedReminder = await prisma.recordatorio.findUnique({ where: { id: reminder.id } });
      expect(updatedReminder).not.toBeNull();
      // Si el job pudo enviar el recordatorio, el campo "enviado" debería ser true.
      expect(updatedReminder!.enviado).toBe(true);
    });
  });

  describe('Google Auth', () => {
    it('Debe fallar si no se proporciona el parámetro "code"', async () => {
      const res = await request(app)
        .get('/api/auth/google/callback');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/No se recibió el parámetro "code"/);
    });

    it('Debe fallar con un token de Google inválido', async () => {
      // Si se proporciona un código, pero éste es inválido, se espera un error.
      const res = await request(app)
        .get('/api/auth/google/callback')
        .query({ code: 'codigo_invalido' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Error en autenticación con Google/);
    });
  });
});
