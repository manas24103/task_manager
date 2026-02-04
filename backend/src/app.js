const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const swaggerConfig = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Custom logging middleware for evaluation purposes
const evaluationLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`🔍 [${timestamp}] ${req.method} ${req.originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields from logs
    delete sanitizedBody.password;
    delete sanitizedBody.refreshToken;
    console.log(`📝 [${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
  }
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`📤 [${timestamp}] Response Status: ${res.statusCode} - Size: ${data ? data.length : 0} bytes`);
    return originalSend.call(this, data);
  };
  
  next();
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Cookie parser middleware (REQUIRED for cookie-based auth)
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));
app.use(evaluationLogger);

// API Versioning
const API_VERSION = '/api/v1';

// Routes
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/tasks`, taskRoutes);

// Swagger documentation
swaggerConfig(app);

// Health check
app.get('/health', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`🏥 [${timestamp}] Health check requested from IP: ${req.ip}`);
  
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: timestamp,
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`❌ [${timestamp}] 404 - Route not found: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
