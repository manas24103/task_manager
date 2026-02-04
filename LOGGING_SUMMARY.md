# TaskFlow - Comprehensive Logging System

## Overview

TaskFlow includes extensive logging for evaluation purposes. All user actions, API requests, and system events are logged with detailed information including timestamps, IP addresses, user agents, and relevant data.

## 🔍 Logging Categories

### **Backend Logging**

#### **1. Application-Level Logging** (`app.js`)
- **Request Logging**: All HTTP requests with method, URL, IP, and User-Agent
- **Request Body**: Sanitized request data (passwords and tokens excluded)
- **Response Logging**: Status codes and response sizes
- **Health Check**: Health check requests with IP tracking
- **404 Errors**: Route not found errors with details

#### **2. Authentication Logging** (`auth.controller.js`)
- **User Registration**:
  ```
  👤 [timestamp] USER REGISTRATION ATTEMPT - IP: [ip]
  📧 [timestamp] Registration Email: [email]
  👔 [timestamp] Registration Role: [role]
  👤 [timestamp] Registration Username: [username]
  ✅ [timestamp] USER REGISTRATION SUCCESSFUL
  🆔 [timestamp] New User ID: [id]
  ```

- **User Login**:
  ```
  🔐 [timestamp] USER LOGIN ATTEMPT - IP: [ip]
  📧 [timestamp] Login Email: [email]
  ✅ [timestamp] USER LOGIN SUCCESSFUL
  🆔 [timestamp] User ID: [id]
  👤 [timestamp] Username: [username]
  👔 [timestamp] Role: [role]
  🔑 [timestamp] Access Token Generated: [token_preview]
  🔄 [timestamp] Refresh Token Generated: [token_preview]
  ```

- **User Logout**:
  ```
  🚪 [timestamp] USER LOGOUT ATTEMPT - IP: [ip]
  🆔 [timestamp] Logout User ID: [id]
  👤 [timestamp] Logout Username: [username]
  👔 [timestamp] Logout User Role: [role]
  ✅ [timestamp] USER LOGOUT SUCCESSFUL
  🧹 [timestamp] Refresh token cleared for user: [username]
  🍪 [timestamp] Cookies cleared
  ```

#### **3. Task Management Logging** (`task.controller.js`)
- **Task Fetch**:
  ```
  📋 [timestamp] TASK FETCH ATTEMPT - IP: [ip]
  👤 [timestamp] Requesting User: [username] ([role])
  🔍 [timestamp] Query Filters: [filters]
  ✅ [timestamp] TASKS FETCHED SUCCESSFULLY
  📊 [timestamp] Total tasks returned: [count]
  ```

- **Task Creation**:
  ```
  ➕ [timestamp] TASK CREATION ATTEMPT - IP: [ip]
  👤 [timestamp] Creating User: [username] ([role])
  📝 [timestamp] Task Data: [task_data]
  ✅ [timestamp] TASK CREATED SUCCESSFULLY
  🆔 [timestamp] New Task ID: [id]
  📋 [timestamp] Task Title: [title]
  🎯 [timestamp] Task Status: [status]
  ⭐ [timestamp] Task Priority: [priority]
  ```

#### **4. User Management Logging** (`user.controller.js`)
- **Admin User List**:
  ```
  👥 [timestamp] ADMIN USER LIST REQUEST - IP: [ip]
  👑 [timestamp] Requesting Admin: [username] ([role])
  📊 [timestamp] Pagination - Limit: [limit], Offset: [offset]
  ✅ [timestamp] USERS LISTED SUCCESSFULLY
  👥 [timestamp] Total users returned: [count]
  ```

- **User Deletion**:
  ```
  🗑️ [timestamp] ADMIN USER DELETION ATTEMPT - IP: [ip]
  👑 [timestamp] Deleting Admin: [username] ([role])
  🎯 [timestamp] Target User ID: [id]
  ✅ [timestamp] USER DELETED SUCCESSFULLY
  🆔 [timestamp] Deleted User ID: [id]
  👤 [timestamp] Deleted Username: [username]
  📧 [timestamp] Deleted Email: [email]
  👔 [timestamp] Deleted Role: [role]
  ```

### **Frontend Logging**

#### **1. Authentication Context** (`AuthContext.jsx`)
- **Login Attempts**:
  ```
  🔐 [timestamp] FRONTEND LOGIN ATTEMPT
  📧 [timestamp] Login Email: [email]
  🌐 [timestamp] User Agent: [user_agent]
  ✅ [timestamp] FRONTEND LOGIN SUCCESSFUL
  👤 [timestamp] Logged in User: [username]
  👔 [timestamp] User Role: [role]
  🆔 [timestamp] User ID: [id]
  ```

- **Registration Attempts**:
  ```
  👤 [timestamp] FRONTEND REGISTRATION ATTEMPT
  📧 [timestamp] Registration Email: [email]
  👤 [timestamp] Registration Username: [username]
  👔 [timestamp] Registration Role: [role]
  ✅ [timestamp] FRONTEND REGISTRATION SUCCESSFUL
  ```

- **Logout Actions**:
  ```
  🚪 [timestamp] FRONTEND LOGOUT ATTEMPT
  👤 [timestamp] Logging out User: [username]
  👔 [timestamp] User Role: [role]
  ✅ [timestamp] FRONTEND LOGOUT SUCCESSFUL
  🧹 [timestamp] Local storage cleared
  ```

#### **2. Task Management** (`Tasks.jsx`)
- **Task Fetch**:
  ```
  📋 [timestamp] FRONTEND TASK FETCH ATTEMPT
  👤 [timestamp] Fetching User: [username] ([role])
  🔍 [timestamp] Fetch Filters: [filters]
  ✅ [timestamp] FRONTEND TASKS FETCHED SUCCESSFULLY
  📊 [timestamp] Total tasks received: [count]
  ```

- **Task Creation/Update**:
  ```
  ➕ [timestamp] FRONTEND TASK CREATION ATTEMPT
  👤 [timestamp] Creating User: [username] ([role])
  📝 [timestamp] Task Data: [task_data]
  ✅ [timestamp] FRONTEND TASK CREATED SUCCESSFULLY
  ```

#### **3. Admin Panel** (`Admin.jsx`)
- **User Management**:
  ```
  👥 [timestamp] FRONTEND ADMIN USER LIST REQUEST
  👑 [timestamp] Admin User: [username] ([role])
  ✅ [timestamp] FRONTEND USERS LISTED SUCCESSFULLY
  👥 [timestamp] Total users received: [count]
  ```

- **User Deletion**:
  ```
  🗑️ [timestamp] FRONTEND ADMIN USER DELETION ATTEMPT
  👑 [timestamp] Deleting Admin: [username] ([role])
  🎯 [timestamp] Target User ID: [id]
  👤 [timestamp] Target Username: [username]
  ✅ [timestamp] FRONTEND USER DELETED SUCCESSFULLY
  ```

- **Role Changes**:
  ```
  🔄 [timestamp] FRONTEND ADMIN ROLE CHANGE ATTEMPT
  👑 [timestamp] Admin User: [username] ([role])
  🎯 [timestamp] Target User ID: [id]
  🔄 [timestamp] New Role: [role]
  ✅ [timestamp] FRONTEND USER ROLE UPDATED SUCCESSFULLY
  ```

## 🎯 Key Features of the Logging System

### **Security & Privacy**
- **Sensitive Data Protection**: Passwords and tokens are masked in logs
- **IP Address Tracking**: All requests logged with originating IP
- **User Agent Logging**: Browser and device information captured
- **Timestamp Precision**: ISO format timestamps for precise tracking

### **Comprehensive Coverage**
- **Full User Journey**: From registration to task management
- **Admin Actions**: All administrative operations are logged
- **Error Tracking**: Failed operations with detailed error messages
- **Success Confirmation**: All successful operations are confirmed

### **Evaluation Benefits**
- **User Behavior Analysis**: Track how users interact with the system
- **Performance Monitoring**: Identify bottlenecks and slow operations
- **Security Auditing**: Track all administrative and sensitive operations
- **Debugging Support**: Detailed logs for troubleshooting issues

## 📊 Log Analysis Examples

### **User Session Tracking**
```
🔐 [2024-01-15T10:30:00Z] USER LOGIN ATTEMPT - IP: 192.168.1.100
✅ [2024-01-15T10:30:02Z] USER LOGIN SUCCESSFUL
📋 [2024-01-15T10:30:05Z] TASK FETCH ATTEMPT
➕ [2024-01-15T10:32:15Z] TASK CREATION ATTEMPT
✅ [2024-01-15T10:32:17Z] TASK CREATED SUCCESSFULLY
🚪 [2024-01-15T11:45:30Z] USER LOGOUT ATTEMPT
✅ [2024-01-15T11:45:31Z] USER LOGOUT SUCCESSFUL
```

### **Admin Action Tracking**
```
👑 [2024-01-15T09:00:00Z] ADMIN USER LIST REQUEST
🗑️ [2024-01-15T09:05:00Z] ADMIN USER DELETION ATTEMPT
✅ [2024-01-15T09:05:02Z] USER DELETED SUCCESSFULLY
🔄 [2024-01-15T09:10:00Z] ADMIN ROLE CHANGE ATTEMPT
✅ [2024-01-15T09:10:01Z] USER ROLE UPDATED SUCCESSFULLY
```

## 🔧 Log Configuration

### **Backend Configuration**
- **Morgan**: HTTP request logging in combined format
- **Custom Middleware**: Application-specific logging with emojis
- **Error Handling**: Comprehensive error logging with context
- **Security**: Sensitive data automatically filtered

### **Frontend Configuration**
- **Console Logging**: Browser console with structured format
- **Error Handling**: Try-catch blocks with detailed error logging
- **User Context**: All logs include user information when available
- **Action Tracking**: Every user action is logged with context

## 📈 Monitoring & Analytics

### **Real-time Monitoring**
- Watch console logs for live user activity
- Track admin operations in real-time
- Monitor system performance and errors
- Identify usage patterns and bottlenecks

### **Log Analysis**
- User registration and login trends
- Task creation and completion rates
- Admin operation frequency
- Error rates and patterns
- Geographic distribution (based on IP)

### **Security Monitoring**
- Failed login attempts
- Unauthorized access attempts
- Suspicious user behavior
- Admin action auditing

## 🚀 Production Considerations

### **Log Rotation**
- Implement log rotation for long-running applications
- Archive old logs for historical analysis
- Monitor log file sizes to prevent disk space issues

### **Log Aggregation**
- Consider centralized logging solutions
- Implement log shipping for distributed systems
- Use log management tools for analysis

### **Performance Impact**
- Logging is optimized for minimal performance impact
- Async logging can be implemented for high-traffic applications
- Log levels can be adjusted for production vs development

This comprehensive logging system provides complete visibility into all user actions and system operations, making it ideal for evaluation, debugging, and monitoring purposes.
