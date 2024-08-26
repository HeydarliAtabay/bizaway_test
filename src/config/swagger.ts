const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Trip Manager API',
        version: '1.0.0',
        description: 'Trip Manager APIs for Bizaway test project',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT}/`,
        },
      ],
      tags: [
        {
          name: 'Bonus tasks',
          description: 'Operations related to trip managment',
        },
        {
            name:'Main task',
            description: 'Get trips from third party API'
        }
      ],
      components: {
        schemas: {
          Trip: {
            type: 'object',
            properties: {
              origin: {
                type: 'string',
                description: 'IATA 3-letter code for the origin',
              },
              destination: {
                type: 'string',
                description: 'IATA 3-letter code for the destination',
              },
              cost: {
                type: 'number',
                description: 'Cost of the trip',
              },
              duration: {
                type: 'number',
                description: 'Duration of the trip in hours',
              },
              type: {
                type: 'string',
                description: 'Type of the trip, e.g., car, plane, train',
              },
              display_name: {
                type: 'string',
                description: 'A user-friendly name for the trip',
              },
            },
          },
        },
      },
    },
    apis: ['./src/routes/endpoints/*.ts'],
  };
  
  export default swaggerOptions;
  