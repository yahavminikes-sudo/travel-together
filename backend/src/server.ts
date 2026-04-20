import { IDatabase } from './entities/IDatabase';
import { IWebServer } from './entities/IWebServer';

export const startServer = async (database: IDatabase, webServer: IWebServer, port: number | string): Promise<void> => {
  try {
    // 1. Connect to the provided database
    await database.connect();

    // 2. --- Manual Dependency Injection Setup ---
    // In future steps, we will instantiate Models, Services, Controllers and Routers here.
    // e.g.
    // const userModel = UserModel;
    // const authService = new AuthService(userModel);
    // const authController = new AuthController(authService);
    // const authRouter = createAuthRouter(authController);
    // -----------------------------------------
    
    // 3. Start listening through the agnostic web server interface
    await webServer.start(port);

    // 4. Graceful shutdown helper
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
