// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useDoctorAuthStore from '../store/doctorAuthStore';
import useClientAuthStore from '../store/clientAuthStore';

const ProtectedRoute = ({ children, role }) => {
  const {
    isAuthenticatedD: isDoctor,
    isCheckingAuthD: isDoctorChecking
  } = useDoctorAuthStore();

  const {
    isAuthenticatedC: isClient,
    isCheckingAuthC: isClientChecking
  } = useClientAuthStore();

  // Show loading while checking auth
  if (isDoctorChecking || isClientChecking) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  // Role-based access control
  if (role === 'doctor' && isDoctor) return children;
  if (role === 'client' && isClient) return children;

  // Redirect unauthorized users
  return <Navigate to="/" />;
};

export default ProtectedRoute;
