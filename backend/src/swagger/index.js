import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Karigar API',
      version: '1.0.0',
      description: 'Quick starter template with authentication',
      contact: {
        name: 'API Team',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Auth endpoints' },
      { name: 'Admin', description: 'Admin operations' },
    ],
  },
  apis: [
    path.join(__dirname, './auth.yaml'),
    path.join(__dirname, './admin.yaml'),
    path.join(__dirname, './schemas.yaml'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
