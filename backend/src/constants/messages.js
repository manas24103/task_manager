module.exports = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_REQUIRED: 'Access token is required',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token'
  },
  
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User with this email already exists',
    ACCESS_DENIED: 'Access denied'
  },
  
  TASK: {
    CREATED: 'Task created successfully',
    UPDATED: 'Task updated successfully',
    DELETED: 'Task deleted successfully',
    NOT_FOUND: 'Task not found',
    ACCESS_DENIED: 'Access denied: You can only access your own tasks'
  },
  
  VALIDATION: {
    FAILED: 'Validation failed',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PASSWORD: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    PASSWORD_LENGTH: 'Password must be at least 8 characters long'
  },
  
  SERVER: {
    INTERNAL_ERROR: 'Internal Server Error',
    DATABASE_ERROR: 'Database error',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
  }
};
