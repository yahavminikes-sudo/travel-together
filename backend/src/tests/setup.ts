import { clearMockGoogleCredentials } from './utils/testApp';
import dotenv from 'dotenv';
import path from 'path';

// Load .testenv before any other imports
dotenv.config({ path: path.resolve(__dirname, '../../../.testenv') });

import mongoose from 'mongoose';
import { appConfig } from '../config/appConfig';

beforeAll(async () => {
  // Ensure we are in test mode and using the correct test URI to prevent accidental data wipes
  if (!appConfig.MONGO_URI.includes('test')) {
    console.error('CRITICAL: Target database is not a test database! Aborting to prevent data loss.');
    process.exit(1);
  }
  await mongoose.connect(appConfig.MONGO_URI);
});

afterEach(async () => {
  clearMockGoogleCredentials();

  // Clear all collections after each test so tests don't pollute each other
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
