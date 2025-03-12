import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

let accessToken: string;
let refreshToken: string;
let eventId: string;
let calendarId: string;
let noteId: string;
let scheduleId: string;

const testUser = {
  nombre: 'Usuario Test',
  email: 'test@example.com',
  password: 'password123',
};

describe('Pruebas de Integración - API Agenda Personal', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de test
    await prisma.$connect();
    // Limpiar tablas relevantes
    await prisma.refreshToken.deleteMany({});
    await prisma.recordatorio.deleteMany({});
    await prisma.evento.deleteMany({});
    await prisma.calendario.deleteMany({});
    await prisma.nota.deleteMany({});
    await prisma.horario.deleteMany({});
    // Si el usuario ya existe, eliminarlo
    await prisma.usuario.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    // Desconectar de la base de datos
    await prisma.$disconnect();
  });

  describe('Autenticación', () => {
    it('Debería registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuario registrado exitosamente');
    });

    it('Debería iniciar sesión y obtener tokens', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it('Debería renovar el token con el refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      // Actualizar tokens para uso posterior
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });
  });

  describe('Usuario - Perfil', () => {
    it('Debería obtener el perfil del usuario', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testUser.email);
    });

    it('Debería actualizar el perfil del usuario', async () => {
      const nuevosDatos = {
        nombre: 'Usuario Actualizado',
        email: 'actualizado@example.com',
      };
      const res = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(nuevosDatos);
      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe(nuevosDatos.nombre);
      expect(res.body.email).toBe(nuevosDatos.email);
      // Actualizar email para usos posteriores
      testUser.email = nuevosDatos.email;
    });
  });

  describe('Eventos', () => {
    it('Debería crear un evento', async () => {
      const eventData = {
        titulo: 'Evento de Test',
        descripcion: 'Descripción del evento de prueba',
        ubicacion: 'Oficina',
        fechaInicio: new Date(Date.now() + 3600000).toISOString(), // +1 hora
        fechaFin: new Date(Date.now() + 7200000).toISOString(), // +2 horas
      };
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(eventData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      eventId = res.body.id;
    });

    it('Debería obtener los eventos del usuario', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Verifica que el evento creado esté en la lista
      const evento = res.body.find((e: any) => e.id === eventId);
      expect(evento).toBeDefined();
    });

    it('Debería actualizar el evento', async () => {
      const updateData = {
        titulo: 'Evento Actualizado',
        descripcion: 'Descripción actualizada',
      };
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe(updateData.titulo);
      expect(res.body.descripcion).toBe(updateData.descripcion);
    });

    it('Debería eliminar (soft delete) el evento', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/eliminado/);
    });
  });

  describe('Calendarios', () => {
    it('Debería crear un calendario', async () => {
      const res = await request(app)
        .post('/api/calendars')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ titulo: 'Calendario de Test' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      calendarId = res.body.id;
    });

    it('Debería obtener los calendarios del usuario', async () => {
      const res = await request(app)
        .get('/api/calendars')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const calendario = res.body.find((c: any) => c.id === calendarId);
      expect(calendario).toBeDefined();
    });

    it('Debería actualizar el calendario', async () => {
      const res = await request(app)
        .put(`/api/calendars/${calendarId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ titulo: 'Calendario Actualizado' });
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe('Calendario Actualizado');
    });

    it('Debería eliminar (soft delete) el calendario', async () => {
      const res = await request(app)
        .delete(`/api/calendars/${calendarId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/eliminado/);
    });
  });

  describe('Notas', () => {
    it('Debería crear una nota', async () => {
      const noteData = {
        titulo: 'Nota de Test',
        contenido: 'Contenido de la nota de prueba',
      };
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(noteData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      noteId = res.body.id;
    });

    it('Debería obtener las notas del usuario', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const nota = res.body.find((n: any) => n.id === noteId);
      expect(nota).toBeDefined();
    });

    it('Debería actualizar la nota', async () => {
      const updateData = {
        titulo: 'Nota Actualizada',
        contenido: 'Contenido actualizado',
      };
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe(updateData.titulo);
      expect(res.body.contenido).toBe(updateData.contenido);
    });

    it('Debería eliminar (soft delete) la nota', async () => {
      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/eliminada/);
    });
  });

  describe('Horarios', () => {
    it('Debería crear un horario', async () => {
      const now = Date.now();
      const scheduleData = {
        inicio: new Date(now + 3600000).toISOString(), // +1 hora
        fin: new Date(now + 7200000).toISOString(),     // +2 horas
      };
      const res = await request(app)
        .post('/api/schedules')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(scheduleData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      scheduleId = res.body.id;
    });

    it('Debería obtener los horarios del usuario', async () => {
      const res = await request(app)
        .get('/api/schedules')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const horario = res.body.find((h: any) => h.id === scheduleId);
      expect(horario).toBeDefined();
    });

    it('Debería actualizar el horario', async () => {
      const now = Date.now();
      const updateData = {
        inicio: new Date(now + 5400000).toISOString(), // +1.5 horas
        fin: new Date(now + 9000000).toISOString(),     // +2.5 horas
      };
      const res = await request(app)
        .put(`/api/schedules/${scheduleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);
      expect(res.status).toBe(200);
      // Se pueden agregar más aserciones para validar las fechas
    });

    it('Debería eliminar (soft delete) el horario', async () => {
      const res = await request(app)
        .delete(`/api/schedules/${scheduleId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/eliminado/);
    });
  });

  describe('Endpoints de Administración', () => {
    // Suponiendo que para los endpoints de admin se requiere un usuario con rol ADMIN,
    // aquí se puede realizar un registro/inicio de sesión específico o simular el rol.
    // Para este ejemplo, se asume que se puede modificar el token o tener un usuario admin preexistente.
    // Se muestra el acceso al endpoint de dashboard.

    it('Debería acceder al dashboard de administrador', async () => {
      // Se simula un token con rol ADMIN. En un entorno real, registra o actualiza el usuario para tener rol ADMIN.
      const adminToken = accessToken; // Reemplazar por un token con rol ADMIN si se dispone de uno.
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);
      // Dependiendo de la lógica de autorización, este test debe ajustarse
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/dashboard/);
    });
  });
});
