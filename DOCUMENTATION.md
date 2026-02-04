# TaskFlow - Comprehensive Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication System](#authentication-system)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Frontend Architecture](#frontend-architecture)
7. [Security Implementation](#security-implementation)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

## Overview

TaskFlow is a modern, full-stack task management application featuring:
- **Glass Morphism UI**: Modern dark theme with frosted glass effects
- **Role-Based Access Control**: User and admin roles with different permissions
- **Cookie-Based Authentication**: Secure JWT authentication with httpOnly cookies
- **Real-Time Task Management**: Create, read, update, and delete tasks
- **Admin Dashboard**: Complete user management system
- **Responsive Design**: Mobile-optimized interface

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React SPA)   │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - Glass UI      │    │ - JWT Auth      │    │ - Users         │
│ - State Mgmt     │    │ - Role-Based    │    │ - Tasks         │
│ - API Client    │    │ - Validation    │    │ - Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Swagger** - API documentation

#### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Tailwind CSS** - Utility-first CSS
- **React Toastify** - Notifications

## Authentication System

### Cookie-Based Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database

    C->>S: POST /auth/login (credentials)
    S->>DB: Validate user credentials
    DB-->>S: User data
    S->>S: Generate JWT tokens
    S->>S: Set httpOnly cookies
    S-->>C: Response with user data

    Note over C,S: Subsequent requests include cookies automatically

    C->>S: GET /tasks (with cookies)
    S->>S: Extract token from cookies
    S->>S: Verify JWT token
    S->>DB: Fetch user tasks
    DB-->>S: Task data
    S-->>C: Response
```

### Token Management

#### Access Token
- **Purpose**: API authentication
- **Expiry**: 15 minutes
- **Storage**: httpOnly cookie
- **Security**: Cannot be accessed by JavaScript

#### Refresh Token
- **Purpose**: Generate new access tokens
- **Expiry**: 7 days
- **Storage**: httpOnly cookie
- **Security**: Cannot be accessed by JavaScript

### Role-Based Access Control

#### User Roles
- **User**: Can manage own tasks only
- **Admin**: Can manage all users and tasks

#### Access Control Implementation
```javascript
// Middleware for role checking
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  next();
};

// Route protection
router.get('/users', authenticateToken, authorize(['admin']), UserController.getAllUsers);
```

## API Documentation

### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://api.taskflow.com/api/v1`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh
Cookie: accessToken=<current_access_token>
```

#### Logout
```http
POST /auth/logout
Cookie: accessToken=<access_token>
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /users?limit=20&offset=0
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

### Task Management Endpoints

#### Get Tasks
```http
GET /tasks?status=pending&priority=high
Authorization: Bearer <token>
```

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive API documentation",
  "priority": "medium"
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "priority": "high"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics
```http
GET /tasks/stats
Authorization: Bearer <token>
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  user_id: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Database Indexes
```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Task indexes
db.tasks.createIndex({ user_id: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ priority: 1 });
db.tasks.createIndex({ createdAt: -1 });
```

## Frontend Architecture

### Component Structure
```
src/
├── components/
│   ├── ProtectedRoute.jsx    # Route protection wrapper
│   └── AdminRoute.jsx        # Admin-only routes
├── pages/
│   ├── Login.jsx             # Authentication
│   ├── Register.jsx          # User registration
│   ├── Dashboard.jsx         # User dashboard
│   ├── Tasks.jsx             # Task management
│   └── Admin.jsx             # Admin panel
├── context/
│   └── AuthContext.jsx       # Global auth state
├── api/
│   ├── index.js              # Axios configuration
│   ├── auth.api.js           # Auth API calls
│   ├── task.api.js           # Task API calls
│   └── user.api.js           # User API calls
└── App.jsx                   # Main application
```

### State Management

#### AuthContext
```javascript
const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false
});
```

#### Protected Routes
```javascript
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### API Client Configuration
```javascript
// Axios setup with cookie support
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Enable cookies
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Security Implementation

### Authentication Security
- **httpOnly Cookies**: Prevents XSS attacks on tokens
- **Secure Flag**: Ensures cookies only sent over HTTPS
- **SameSite Policy**: Prevents CSRF attacks
- **Token Expiration**: Short-lived access tokens
- **Password Hashing**: bcrypt with salt rounds

### Input Validation
- **Joi Schemas**: Server-side validation for all inputs
- **Yup Schemas**: Client-side validation
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: Input sanitization

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

## Deployment Guide

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
ACCESS_TOKEN_SECRET=your_strong_access_secret
REFRESH_TOKEN_SECRET=your_strong_refresh_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com
COOKIE_SECURE=true
```

### Production Deployment Steps

#### 1. Database Setup
```bash
# MongoDB setup with authentication
mongod --auth

# Create database and user
mongo
use taskflow
db.createUser({
  user: "taskflow_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "taskflow" }]
})
```

#### 2. Backend Deployment
```bash
# Install dependencies
npm ci --production

# Build and start
npm run build
npm start
```

#### 3. Frontend Deployment
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Deploy to static hosting
# (Vercel, Netlify, AWS S3, etc.)
```

#### 4. Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/taskflow/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/taskflow?authSource=admin
    depends_on:
      - mongodb
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Troubleshooting

### Common Issues

#### 1. Authentication Issues
**Problem**: "Access denied" or "Invalid token"
**Solution**: 
- Check cookie settings in browser
- Verify environment variables
- Clear browser cookies and localStorage
- Check token expiration

#### 2. Database Connection Issues
**Problem**: "MongoDB connection failed"
**Solution**:
- Verify MongoDB is running
- Check connection string
- Ensure proper authentication
- Check firewall settings

#### 3. CORS Issues
**Problem**: "CORS policy error"
**Solution**:
- Verify FRONTEND_URL environment variable
- Check CORS configuration
- Ensure credentials: true in frontend requests

#### 4. Build Issues
**Problem**: "Build failed" or "Module not found"
**Solution**:
- Clear node_modules and reinstall
- Check package.json dependencies
- Verify Node.js version compatibility

### Debug Mode

#### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check environment variables
npm run env

# Test database connection
node scripts/test-db.js
```

#### Frontend Debugging
```bash
# Enable verbose logging
VITE_LOG_LEVEL=debug npm run dev

# Check network requests
# Open browser DevTools -> Network tab
```

### Performance Monitoring

#### Backend Metrics
- Response times
- Error rates
- Database query performance
- Memory usage

#### Frontend Metrics
- Bundle size analysis
- Component render times
- Network request performance
- User interaction metrics

### Health Checks

#### Backend Health Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

#### Database Health Check
```javascript
const healthCheck = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'OK', database: 'Connected' };
  } catch (error) {
    return { status: 'ERROR', database: error.message };
  }
};
```

This documentation provides a comprehensive guide to the TaskFlow application, covering all aspects from architecture to deployment and troubleshooting.
