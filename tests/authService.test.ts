import { register, login } from '../src/services/authService';
import * as userRepository from '../src/repositories/userRepository';
import * as refreshTokenRepository from '../src/repositories/refreshTokenRepository';
import bcrypt from 'bcrypt';

jest.mock('../src/repositories/userRepository');
jest.mock('../src/repositories/refreshTokenRepository');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe registrar un nuevo usuario', async () => {
    const data = {
      nombre: 'Test',
      email: 'test@example.com',
      password: 'password123',
    };

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 💡 Usamos `any` para que no se queje Babel ni TypeScript
    (userRepository.createUser as any).mockResolvedValue({
      id: '1',
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      rol: 'USER',
    });

    const user = await register(data);

    expect(user.email).toBe(data.email);
    expect((userRepository.createUser as any)).toHaveBeenCalledWith({
      nombre: data.nombre,
      email: data.email,
      password: expect.any(String),
    });
  });

  test('debe loguear un usuario', async () => {
    const data = { email: 'test@example.com', password: 'password123' };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    (userRepository.findByEmail as any).mockResolvedValue({
      id: '1',
      email: data.email,
      password: hashedPassword,
      rol: 'USER',
    });

    (refreshTokenRepository.createRefreshToken as any).mockResolvedValue({
      id: 'refresh1',
      usuarioId: '1',
      token: 'mocked-refresh-token',
      fecha_expiracion: new Date(),
    });

    const tokens = await login(data);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect((userRepository.findByEmail as any)).toHaveBeenCalledWith(data.email);
    expect((refreshTokenRepository.createRefreshToken as any)).toHaveBeenCalled();
  });
});
