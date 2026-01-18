import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { formatErrorMessage } from '../services/errorHandler';
import toast from 'react-hot-toast';

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
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verify token by fetching current user
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          // Token invalid, clear auth
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = formatErrorMessage(error);
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = formatErrorMessage(error);
      toast.error(message);
      
      // Extract field-specific errors if available
      const errors = error.response?.data?.errors || null;
      
      return { 
        success: false, 
        error: message,
        errors: errors
      };
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isEmployee = () => {
    return user?.role === 'employee';
  };

  const isEmployer = () => {
    return user?.role === 'employer';
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    isEmployee,
    isEmployer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
