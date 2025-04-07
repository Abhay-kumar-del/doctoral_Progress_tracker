
import React from 'react';
import Sidebar from './Sidebar';
import SupervisorSidebar from './SupervisorSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { userName, userRole } = useAuth();
  const isSupervisor = userRole === 'supervisor';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isSupervisor ? (
        <SupervisorSidebar userName={userName || 'Supervisor'} className="hidden md:flex" />
      ) : (
        <Sidebar userName={userName || 'User'} className="hidden md:flex" />
      )}
      
      <main className="flex-1 overflow-auto">
        {/* Mobile header only - no duplicate navbar */}
        <div className="md:hidden w-full">
          <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-600">
              {isSupervisor ? 'Supervisor Portal' : 'Student Portal'}
            </h2>
            <span className="text-sm text-gray-500">{userName || 'User'}</span>
          </div>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
