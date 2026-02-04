const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'A modern task management API with authentication, role-based access control, and admin management features. Built with Node.js, Express, and MongoDB.',
      contact: {
        name: 'TaskFlow Development Team',
        email: 'dev@taskflow.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.taskflow.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authentication. Use the token returned from login endpoint.'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'HTTP-only cookie containing JWT access token (automatically handled by browser)'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              example: '507f1f77bcf86cd799439011',
              description: 'MongoDB ObjectId'
            },
            fullName: { 
              type: 'string', 
              example: 'John Doe',
              description: 'User full name'
            },
            username: { 
              type: 'string', 
              example: 'johndoe',
              description: 'Unique username'
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: 'john@example.com',
              description: 'User email address'
            },
            role: { 
              type: 'string', 
              enum: ['user', 'admin'],
              example: 'user',
              description: 'User role for access control'
            },
            isVerified: { 
              type: 'boolean', 
              example: true,
              description: 'Email verification status'
            },
            lastLogin: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Last login timestamp'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-01-01T00:00:00Z',
              description: 'Account creation date'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Last update timestamp'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: { 
              type: 'string', 
              example: '507f1f77bcf86cd799439011',
              description: 'MongoDB ObjectId'
            },
            title: { 
              type: 'string', 
              example: 'Complete project documentation',
              description: 'Task title'
            },
            description: { 
              type: 'string', 
              example: 'Write comprehensive documentation for the TaskFlow project including API endpoints and user guide',
              description: 'Detailed task description'
            },
            status: { 
              type: 'string', 
              enum: ['pending', 'in_progress', 'completed'],
              example: 'in_progress',
              description: 'Current task status'
            },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high'],
              example: 'medium',
              description: 'Task priority level'
            },
            user_id: { 
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: 'Reference to user who owns this task'
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
              description: 'Task creation date'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2024-01-15T14:30:00Z',
              description: 'Last update timestamp'
            }
          }
        },
        TaskStats: {
          type: 'object',
          properties: {
            total: { 
              type: 'integer', 
              example: 25,
              description: 'Total number of tasks'
            },
            status: {
              type: 'object',
              properties: {
                pending: { type: 'integer', example: 8 },
                in_progress: { type: 'integer', example: 12 },
                completed: { type: 'integer', example: 5 }
              },
              description: 'Tasks grouped by status'
            },
            priority: {
              type: 'object',
              properties: {
                low: { type: 'integer', example: 10 },
                medium: { type: 'integer', example: 10 },
                high: { type: 'integer', example: 5 }
              },
              description: 'Tasks grouped by priority'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { 
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  description: 'JWT access token (short-lived)'
                },
                refreshToken: { 
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  description: 'JWT refresh token (long-lived)'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['Email is required', 'Password must be at least 6 characters']
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { 
              type: 'object',
              description: 'Response data (varies by endpoint)'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Users retrieved successfully' },
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 20 },
                    total: { type: 'integer', example: 100 },
                    pages: { type: 'integer', example: 5 }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization operations'
      },
      {
        name: 'Users',
        description: 'User management operations (admin only)'
      },
      {
        name: 'Tasks',
        description: 'Task management operations'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

const swaggerConfig = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .scheme-container { margin: 20px 0 }
    `,
    customSiteTitle: 'TaskFlow API Documentation',
    customfavIcon: '/favicon.ico'
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = swaggerConfig;
