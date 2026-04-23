import dotenv from 'dotenv';

// Load environment variables based on the environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.testenv' });
} else {
  dotenv.config();
}

export const appConfig = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-together',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
