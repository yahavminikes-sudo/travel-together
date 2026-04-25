import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { IDocsProvider } from '../../entities/IDocsProvider';
import { swaggerOptions } from './swaggerConfig';

export const createSwaggerDocsProvider = (): IDocsProvider => {
  return {
    getRoutes: () => {
      const swaggerSpec = swaggerJsdoc(swaggerOptions);
      return [
        {
          path: '/api-docs',
          handlers: [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]
        }
      ];
    }
  };
};
