import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`🔐 [${timestamp}] FRONTEND LOGIN ATTEMPT`);
      console.log(`📧 [${timestamp}] Login Email: ${credentials.email}`);
      console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
      
      const response = await authAPI.login(credentials);
      const { user: userData } = response.data.data;
      
      console.log(`✅ [${timestamp}] FRONTEND LOGIN SUCCESSFUL`);
      console.log(`👤 [${timestamp}] Logged in User: ${userData.username}`);
      console.log(`👔 [${timestamp}] User Role: ${userData.role}`);
      console.log(`🆔 [${timestamp}] User ID: ${userData._id}`);
      
      // Only store user data, token is handled by cookies
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND LOGIN FAILED: ${error.response?.data?.message || 'Login failed'}`);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`👤 [${timestamp}] FRONTEND REGISTRATION ATTEMPT`);
      console.log(`📧 [${timestamp}] Registration Email: ${userData.email}`);
      console.log(`👤 [${timestamp}] Registration Username: ${userData.username}`);
      console.log(`👔 [${timestamp}] Registration Role: ${userData.role || 'user'}`);
      console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
      
      const response = await authAPI.register(userData);
      
      console.log(`✅ [${timestamp}] FRONTEND REGISTRATION SUCCESSFUL`);
      console.log(`📧 [${timestamp}] Registered Email: ${userData.email}`);
      
      // Registration doesn't return token, user needs to login
      return { success: true, message: response.data.message };
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND REGISTRATION FAILED: ${error.response?.data?.message || 'Registration failed'}`);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`🚪 [${timestamp}] FRONTEND LOGOUT ATTEMPT`);
      console.log(`👤 [${timestamp}] Logging out User: ${user?.username || 'Unknown'}`);
      console.log(`👔 [${timestamp}] User Role: ${user?.role || 'Unknown'}`);
      console.log(`🌐 [${timestamp}] User Agent: ${navigator.userAgent}`);
      
      await authAPI.logout();
      
      console.log(`✅ [${timestamp}] FRONTEND LOGOUT SUCCESSFUL`);
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.log(`❌ [${timestamp}] FRONTEND LOGOUT ERROR: ${error.message}`);
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      console.log(`🧹 [${timestamp}] Local storage cleared`);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
