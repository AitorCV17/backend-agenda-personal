import { register, login } from '../src/services/authService';
import * as userRepository from '../src/repositories/userRepository';
import bcrypt from 'bcrypt';

jest.mock('../src/repositories/userRepository');

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
    (userRepository.createUser as jest.Mock).mockResolvedValue({
      id: '1',
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      rol: 'USER',
    });

    const user = await register(data);
    expect(user.email).toBe(data.email);
  });

  test('debe loguear un usuario', async () => {
    const data = { email: 'test@example.com', password: 'password123' };
    const hashedPassword = await bcrypt.hash(data.password, 10);
    (userRepository.findByEmail as jest.Mock).mockResolvedValue({
      id: '1',
      email: data.email,
      password: hashedPassword,
      rol: 'USER',
    });

    const tokens = await login(data);
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });
});
