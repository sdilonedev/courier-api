import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: process.env.PORT || 3000,
  accessSecretKey: process.env.ACCESS_SECRET_KEY,
  refreshSecretKey: process.env.REFRESH_SECRET_KEY,
  env: process.env.NODE_ENV || 'dev',
}));
