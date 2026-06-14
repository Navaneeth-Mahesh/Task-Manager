import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description:
        'Production-grade REST API for the TaskFlow Task Management Application. Built with Node.js, Express, MongoDB, and Socket.IO.',
      contact: {
        name: 'TaskFlow Support',
        email: 'support@taskflow.io',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Development server',
      },
      {
        url: 'https://your-app.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'tf_token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            fullname: { type: 'string', example: 'Navaneeth Kumar' },
            email: { type: 'string', example: 'nav@taskflow.io' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            avatar: { type: 'string', example: 'https://res.cloudinary.com/...' },
            isVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'Redesign onboarding flow' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'review', 'completed'],
            },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date-time' },
            progress: { type: 'integer', minimum: 0, maximum: 100 },
            tags: { type: 'array', items: { type: 'string' } },
            createdBy: { $ref: '#/components/schemas/User' },
            assignedTo: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
          },
        },
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
