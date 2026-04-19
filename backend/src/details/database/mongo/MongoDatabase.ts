import mongoose from 'mongoose';
import { IDatabase } from '../../../entities/IDatabase';
import { appConfig } from '../../../config/appConfig';

// Concrete implementation as a const matching the interface type.
// All specific Mongo constants/config usage happens within this implementation layer.
export const mongoDatabase: IDatabase = {
  connect: async (): Promise<void> => {
    console.log(`Connecting to MongoDB at ${appConfig.MONGO_URI}...`);
    await mongoose.connect(appConfig.MONGO_URI as string);
    console.log('Successfully connected to MongoDB.');
  },

  disconnect: async (): Promise<void> => {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
  }
};
