
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'supervisor' | 'coordinator' | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect
  if (requiredRole && userRole !== requiredRole) {
    // Redirect student to student dashboard
    if (userRole === 'student' && (location.pathname.includes('/supervisor') || location.pathname.includes('/coordinator'))) {
      return <Navigate to="/" replace />;
    }
    
    // Redirect supervisor to supervisor dashboard
    if (userRole === 'supervisor' && (location.pathname.includes('/coordinator') || !location.pathname.includes('/supervisor'))) {
      return <Navigate to="/supervisor" replace />;
    }

    // Redirect coordinator to coordinator dashboard
    if (userRole === 'coordinator' && !location.pathname.includes('/coordinator')) {
      return <Navigate to="/coordinator" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
