
import React from 'react';
import SupervisorSidebar from './SupervisorSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface SupervisorDashboardLayoutProps {
  children: React.ReactNode;
}

const SupervisorDashboardLayout = ({ children }: SupervisorDashboardLayoutProps) => {
  const { userName } = useAuth();

  return (
    <div className="flex min-h-screen">
      <SupervisorSidebar userName={userName || 'Supervisor'} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default SupervisorDashboardLayout;
