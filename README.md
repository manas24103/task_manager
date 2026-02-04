# TaskFlow - Modern Task Management System

A full-stack task management application with authentication, role-based access control, and a modern glass morphism UI. Built with Node.js/Express backend and React frontend.

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication with httpOnly cookies
- **bcryptjs** for password hashing
- **Joi** for validation
- **Swagger** for API documentation
- **Helmet** & CORS for security
- **Rate limiting** for API protection
- **Cookie-parser** for cookie-based auth

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls (with cookie support)
- **React Hook Form** with Yup validation
- **Tailwind CSS** for styling
- **React Toastify** for notifications
- **Lucide React** for icons

## 🎨 UI Features
- **Glass Morphism Design**: Modern frosted glass effect
- **Dark Theme**: Elegant dark background with purple/pink gradients
- **Responsive Design**: Mobile-optimized interface
- **Animated Backgrounds**: Pulsing gradient orbs
- **Micro-interactions**: Hover effects and smooth transitions

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── server.js              # Server bootstrap
│   │   ├── config/
│   │   │   ├── env.js             # Environment variables
│   │   │   ├── mongodb.js          # MongoDB connection
│   │   │   └── swagger.js         # Swagger configuration
│   │   ├── models/
│   │   │   ├── User.model.js      # User schema & methods
│   │   │   └── Task.model.js      # Task schema & methods
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── task.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── task.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # JWT verification
│   │   │   └── error.middleware.js    # Global error handler
│   │   ├── services/
│   │   │   ├── auth.service.js        # Auth business logic
│   │   │   └── task.service.js        # Task business logic
│   │   ├── utils/
│   │   │   ├── hash.js                # bcrypt helpers
│   │   │   └── response.js            # Standard API responses
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── task.validator.js
│   │   └── docs/
│   │       └── swagger.yaml           # API documentation
│   ├── scripts/
│   │   └── create-admin.js            # Admin creation script
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── task.test.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── index.js              # Axios setup with cookies
│   │   │   ├── auth.api.js           # Auth API calls
│   │   │   ├── task.api.js           # Task API calls
│   │   │   └── user.api.js           # User API calls
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx        # Admin-only routes
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login with glass morphism
│   │   │   ├── Register.jsx          # Registration with validation
│   │   │   ├── Dashboard.jsx         # User dashboard
│   │   │   ├── Tasks.jsx             # Task management
│   │   │   └── Admin.jsx             # Admin panel
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd taskflow
npm run install-all
```

2. **Set up environment variables:**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
```

3. **Start MongoDB:**
```bash
mongod
```

4. **Start the backend server:**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`
API documentation at `http://localhost:5000/api-docs`

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start the frontend:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Create Admin User

After setting up, create an admin user:
```bash
cd backend
node scripts/create-admin.js
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user (sets httpOnly cookies)
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout user (clears cookies)
- `POST /api/v1/auth/change-password` - Change user password
- `POST /api/v1/auth/forgot-password` - Initiate password reset

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/profile` - Get current user profile
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id/role` - Update user role (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Tasks
- `GET /api/v1/tasks` - Get tasks (filtered by user role)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task by ID
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

## 🔐 Authentication & Security

### Cookie-Based Authentication
- **httpOnly Cookies**: Secure token storage
- **CSRF Protection**: Built-in security with httpOnly
- **Automatic Token Refresh**: Seamless user experience
- **Secure Cookie Handling**: Production-ready security

### User Roles
- **User**: Can only access and manage their own tasks
- **Admin**: Can access all tasks, manage all users, view admin dashboard

### Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi validation for all inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for frontend origin
- **Helmet**: Security headers for Express
- **XSS Protection**: Input sanitization

## 🎯 Features Implemented

### Backend Features
✅ User registration & login with password hashing  
✅ JWT authentication with httpOnly cookies  
✅ Role-based access control (user/admin)  
✅ CRUD operations for tasks  
✅ API versioning (/api/v1)  
✅ Comprehensive error handling  
✅ Input validation & sanitization  
✅ Swagger API documentation  
✅ MongoDB with Mongoose ODM  
✅ Security middleware (Helmet, CORS, rate limiting)  
✅ Admin management system  
✅ Token refresh mechanism  

### Frontend Features
✅ Modern glass morphism UI with dark theme  
✅ User registration & login forms  
✅ Protected dashboard with JWT required  
✅ Task management (CRUD operations)  
✅ Task filtering and statistics  
✅ Admin panel for user management  
✅ Error/success message handling  
✅ Responsive design with Tailwind CSS  
✅ Form validation with React Hook Form  
✅ Toast notifications for user feedback  
✅ Role-based navigation  
✅ Cookie-based authentication  
✅ Animated backgrounds and micro-interactions  

## 🎨 UI/UX Highlights

### Glass Morphism Design
- **Frosted Glass Effect**: `backdrop-blur-xl` with semi-transparent backgrounds
- **Layered Elements**: Multiple glass layers create depth
- **Smooth Animations**: Hover effects and transitions
- **Modern Aesthetics**: Purple/pink gradient accents

### User Experience
- **Intuitive Navigation**: Clear role-based menu structure
- **Visual Feedback**: Loading states, success/error messages
- **Mobile Responsive**: Optimized for all screen sizes
- **Accessibility**: Semantic HTML and ARIA support

## 🚀 Advanced Features

### Admin Dashboard
- **User Management**: View, edit, and delete users
- **Role Management**: Promote/demote users
- **User Statistics**: Track user activity
- **Search & Filter**: Find users quickly

### Task Management
- **Advanced Filtering**: Filter by status, priority, and search
- **Real-time Updates**: Instant task status changes
- **Statistics Dashboard**: Visual task analytics
- **Bulk Operations**: Efficient task management

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  username: String,
  email: String,
  password: String, // Hashed
  role: String, // 'user' | 'admin'
  refreshToken: String,
  isVerified: Boolean,
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String, // 'pending' | 'in_progress' | 'completed'
  priority: String, // 'low' | 'medium' | 'high'
  user_id: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 Development Notes

- Follow REST API design principles
- Use proper HTTP status codes
- Implement comprehensive error handling
- Maintain consistent API response format
- Use environment variables for configuration
- Follow security best practices
- Implement responsive design principles
- Maintain clean, readable code structure

## 🚀 Deployment Considerations

### Production Setup
- Use HTTPS for secure cookie transmission
- Set `COOKIE_SECURE=true` in production
- Configure proper CORS origins
- Implement database indexing for performance
- Set up monitoring and logging
- Use environment-specific configurations

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
ACCESS_TOKEN_SECRET=strong-production-secret
REFRESH_TOKEN_SECRET=strong-production-secret
COOKIE_SECURE=true
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
