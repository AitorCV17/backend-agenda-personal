import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  example: '.env.example',
});

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
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
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000', // 👈 AQUI VA EL CAMBIO
};
