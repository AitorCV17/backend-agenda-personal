import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: '.env.example',
});

export const config = {
  port: process.env.PORT || 3020,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '15m', // Access token: 15 minutos
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d', // Refresh token: 7 días
  email: {
    host: process.env.EMAIL_HOST || '',
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  googleAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
  },
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
