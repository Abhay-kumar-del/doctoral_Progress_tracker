
import React from 'react';
import CoordinatorSidebar from './CoordinatorSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface CoordinatorDashboardLayoutProps {
  children: React.ReactNode;
}

const CoordinatorDashboardLayout = ({ children }: CoordinatorDashboardLayoutProps) => {
  const { userName } = useAuth();

  return (
    <div className="flex min-h-screen">
      <CoordinatorSidebar userName={userName || 'Coordinator'} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default CoordinatorDashboardLayout;
