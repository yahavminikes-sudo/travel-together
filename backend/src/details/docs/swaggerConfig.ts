import { Options } from 'swagger-jsdoc';
import { appConfig } from '../../config/appConfig';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel Together API',
      version: '1.0.0',
      description: 'API documentation for the Travel Together application'
    },
    servers: [
      {
        url: appConfig.BASE_URL,
        description: `${appConfig.NODE_ENV.toLocaleLowerCase()} server`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            avatarUrl: { type: 'string' },
            bio: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            authorId: { type: 'string' },
            author: { $ref: '#/components/schemas/User' },
            commentCount: { type: 'integer' },
            destination: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            imageUrl: { type: 'string' },
            likes: { type: 'array', items: { type: 'string' } },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            postId: { type: 'string' },
            authorId: { type: 'string' },
            author: { $ref: '#/components/schemas/User' },
            content: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/details/docs/api/*.docs.ts'], // Path to the API docs
};
