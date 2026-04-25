import { clearMockGoogleCredentials } from './utils/testApp';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.testenv') });

import mongoose from 'mongoose';
import { appConfig } from '../config/appConfig';

beforeAll(async () => {
  if (!appConfig.MONGO_URI.includes('test')) {
    console.error('CRITICAL: Target database is not a test database! Aborting to prevent data loss.');
    process.exit(1);
  }
  await mongoose.connect(appConfig.MONGO_URI);
});

afterEach(async () => {
  clearMockGoogleCredentials();
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
