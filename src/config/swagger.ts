// src/config/swagger.ts
import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Trip Planner',
      version: '1.0.0',
      description: 'Trip planner APIs for Bizaway Test',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/endpoints/*.ts'], // Path to your API files
};

export default swaggerOptions;
