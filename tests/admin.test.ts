import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

let adminAccessToken: string;

const adminUser = {
  nombre: 'Admin Test',
  email: 'admin@example.com',
  password: 'adminpass123',
  // Nota: el rol se establecerá manualmente en la base de datos
};

describe('Pruebas - Endpoints de Administración', () => {
  beforeAll(async () => {
    // Limpiar cualquier usuario con el email admin
    await prisma.usuario.deleteMany({ where: { email: adminUser.email } });

    // Registrar el usuario admin usando el endpoint de registro
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(adminUser);
    expect(registerRes.status).toBe(201);

    // Forzar que el usuario tenga rol ADMIN
    await prisma.usuario.update({
      where: { email: adminUser.email },
      data: { rol: 'ADMIN' },
    });

    // Iniciar sesión para obtener el token de admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });
    expect(loginRes.status).toBe(200);
    adminAccessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Debería acceder al dashboard de administrador', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/dashboard/);
  });
});
