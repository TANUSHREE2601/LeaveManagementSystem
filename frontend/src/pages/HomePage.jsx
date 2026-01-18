import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import EmployerDashboard from './EmployerDashboard';

const HomePage = () => {
  const { isAuthenticated, isEmployee, isEmployer } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (isEmployee()) {
    return <EmployeeDashboard />;
  }

  if (isEmployer()) {
    return <EmployerDashboard />;
  }

  return <Navigate to="/login" replace />;
};

export default HomePage;
