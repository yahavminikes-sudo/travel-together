import { startServer } from './server';
import { mongoDatabase } from './details/database/mongo/MongoDatabase';
import { createExpressServer } from './details/server/express/expressServer';
import { appConfig } from './config/appConfig';

// 1. Manually instantiate internal Dependencies (Data Providers, Services, Routers)
const dependencies = {
  // To be filled out in Task 6 and future tasks...
};

// 2. Pass dependencies into the specific Web Server implementation
const webServer = createExpressServer(dependencies);

// 3. Start the Orchestration layer
startServer(mongoDatabase, webServer, appConfig.PORT);
