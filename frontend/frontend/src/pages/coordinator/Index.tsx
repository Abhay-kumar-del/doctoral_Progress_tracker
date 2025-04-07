
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CoordinatorIndex = () => {
  const { userRole } = useAuth();

  if (userRole !== 'coordinator') {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/coordinator/publications" replace />;
};

export default CoordinatorIndex;
