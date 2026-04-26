import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.testenv' });
} else {
  dotenv.config();
}

export const appConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-together',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH || 'certs/client-key.pem',
  SSL_CERT_PATH: process.env.SSL_CERT_PATH || 'certs/client-cert.pem'
};
