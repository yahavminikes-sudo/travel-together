import mongoose from 'mongoose';
import { IDatabase } from '../../../entities/IDatabase';
import { appConfig } from '../../../config/appConfig';

export const createMongoDatabase = (): IDatabase => ({
  connect: async (): Promise<void> => {
    console.log(`Connecting to MongoDB at ${appConfig.MONGO_URI}...`);
    await mongoose.connect(appConfig.MONGO_URI);
    console.log('Successfully connected to MongoDB.');
  },

  disconnect: async (): Promise<void> => {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
  }
});
