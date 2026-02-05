import axios from 'axios';

// Try multiple ways to get the API URL
const getApiUrl = () => {
  // Check if we're in production and use the deployed backend URL
  if (import.meta.env.PROD) {
    return 'https://task-manager-r6gx.onrender.com/api/v1';
  }
  
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiUrl();

// Debug: Log the API URL being used
console.log('🔗 Environment:', import.meta.env.MODE);
console.log('🔗 Production:', import.meta.env.PROD);
console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔗 Final API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 🍪 REQUIRED for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const fullUrl = config.baseURL + config.url;
    console.log('🚀 API Request:', config.method?.toUpperCase(), fullUrl);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.config?.url);
    console.log('❌ Error Details:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
