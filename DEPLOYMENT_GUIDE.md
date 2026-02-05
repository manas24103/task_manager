# TaskFlow - Deployment Guide

## 🚀 Full Stack Deployment

This guide will help you deploy TaskFlow with frontend on Vercel and backend on Render/Railway.

## 📋 Prerequisites

- GitHub account with TaskFlow code pushed
- Vercel account (for frontend)
- Render/Railway account (for backend)
- MongoDB Atlas account (for database)

---

## 🗄️ Step 1 - Deploy Backend

### Option A: Render (Recommended)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [Render](https://render.com)** and sign up
3. **Create New Web Service**:
   - Connect your GitHub repository
   - Select `taskflow` repo
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (to start)

4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
   ACCESS_TOKEN_SECRET=your_strong_secret_here
   REFRESH_TOKEN_SECRET=your_strong_refresh_secret_here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   COOKIE_SECURE=true
   ```

5. **Deploy** - Render will build and deploy automatically

### Option B: Railway
1. **Go to [Railway](https://railway.app)** and sign up
2. **New Project** → **Deploy from GitHub repo**
3. Select `taskflow` repository
4. Add environment variables (same as above)
5. Railway will deploy automatically

---

## 🎨 Step 2 - Deploy Frontend

### Deploy to Vercel
1. **Go to [Vercel](https://vercel.com)** and sign up
2. **Import Project** → **Import Git Repository**
3. Select `taskflow` repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api/v1
   VITE_APP_TITLE=TaskFlow
   VITE_NODE_ENV=production
   ```

6. **Deploy** - Vercel will build and deploy automatically

---

## 🔗 Step 3 - Update CORS Configuration

### Update Backend CORS
In your deployed backend, update the CORS configuration:

```javascript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app', // Your Vercel URL
    'http://localhost:3000' // Development
  ],
  credentials: true
}));
```

### Update Frontend Environment
In your Vercel dashboard, set:
```
VITE_API_URL=https://your-backend-url.onrender.com/api/v1
```

---

## 🗄️ Step 4 - Setup Database

### MongoDB Atlas Setup
1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create New Cluster** → Free tier
3. **Database Access** → Create new user
4. **Network Access** → Add IP: `0.0.0.0/0` (allows all)
5. **Get Connection String**:
   - Click "Connect" → "Drivers"
   - Copy the MongoDB URI
   - Replace `<password>` with your actual password

### Update Backend Environment
Add to your backend environment variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
```

---

## 🔄 Step 5 - Final Updates

### Update Backend .env
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow
ACCESS_TOKEN_SECRET=strong_production_secret
REFRESH_TOKEN_SECRET=strong_refresh_secret
FRONTEND_URL=https://your-vercel-app.vercel.app
COOKIE_SECURE=true
```

### Update Frontend .env
```env
VITE_API_URL=https://your-backend-url.onrender.com/api/v1
VITE_APP_TITLE=TaskFlow
VITE_NODE_ENV=production
```

### Push Final Changes
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

Both Vercel and Render will automatically redeploy with the new environment variables.

---

## ✅ Step 6 - Test Deployment

1. **Visit your Vercel URL** (frontend)
2. **Test registration** → Should create user in database
3. **Test login** → Should set cookies and redirect
4. **Test task creation** → Should work with database
5. **Test admin panel** → Should manage users

---

## 🔧 Troubleshooting

### CORS Issues
If you get CORS errors:
1. Check backend CORS configuration
2. Ensure `FRONTEND_URL` matches your Vercel URL exactly
3. Make sure `credentials: true` is set

### Environment Variables
If variables aren't working:
1. Check Vercel/Render dashboards for correct names
2. Restart services after updating variables
3. Check for typos in variable names

### Database Connection
If database fails:
1. Verify MongoDB Atlas connection string
2. Check database user permissions
3. Ensure IP whitelist includes `0.0.0.0/0`

### Build Errors
If build fails:
1. Check package.json scripts
2. Ensure all dependencies are installed
3. Check for syntax errors in code

---

## 🌐 Architecture After Deployment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel      │    │    Render      │    │   MongoDB      │
│   Frontend     │◄──►│   Backend      │◄──►│   Atlas        │
│   (React)      │    │   (Node.js)    │    │   Database     │
│               │    │               │    │               │
│ .vercel.app    │    │ .onrender.com  │    │ .mongodb.net   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🎉 Success!

Your TaskFlow application is now fully deployed and accessible online! Users can:

- Register and login
- Create and manage tasks
- Access admin panel (if admin)
- Use all features with persistent data

### 📊 Monitoring
- **Vercel Dashboard**: Monitor frontend performance
- **Render Dashboard**: Monitor backend health
- **MongoDB Atlas**: Monitor database usage
- **Application Logs**: Track user activity and errors

### 🔄 Updates
Any `git push` to main branch will automatically:
- Redeploy frontend on Vercel
- Redeploy backend on Render
- Update both services simultaneously

Enjoy your deployed TaskFlow application! 🚀
