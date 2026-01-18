import axios from 'axios';
import { API_URL } from '../utils/constants';
import { handleApiError } from './errorHandler';

const api = axios.create({
  baseURL: API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', api.defaults.baseURL);
}

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const handledError = handleApiError(error);

    // Log network errors in development for debugging
    if (import.meta.env.DEV && handledError.type === 'network') {
      console.error('🌐 Network Error Details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        },
      });
      console.log('💡 Tip: Make sure the backend server is running on port 5000');
    }

    // Handle token expiration and authentication errors
    if (handledError.status === 401 || handledError.type === 'authentication') {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on login/signup page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        // Add return URL for redirect after login
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // Enhance error object with handled error details
    error.handledError = handledError;

    return Promise.reject(error);
  }
);

export default api;
