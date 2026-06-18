import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === 'student') {
      return <Navigate to={user.class === '10' ? '/dashboard/class10' : '/dashboard/class12'} replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Double check student class matching dashboard paths
  if (user.role === 'student') {
    if (user.class === '10' && location.pathname.includes('/dashboard/class12')) {
      return <Navigate to="/dashboard/class10" replace />;
    }
    if (user.class === '12' && location.pathname.includes('/dashboard/class10')) {
      return <Navigate to="/dashboard/class12" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
