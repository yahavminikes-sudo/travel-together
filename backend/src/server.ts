import { IDatabase } from './entities/IDatabase';
import { IWebServer } from './entities/IWebServer';

export const startServer = async (database: IDatabase, webServer: IWebServer, port: number | string): Promise<void> => {
  try {
    await database.connect();

    await webServer.start(port);

    const shutdown = async () => {
      console.log('Shutting down server...');
      await webServer.stop();
      await database.disconnect();
      console.log('Server stopped cleanly.');
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
    throw error;
  }
};
