
import React from 'react';
import { User, Settings } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import InfoCard from '@/components/InfoCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { userName } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar userName={userName || 'Guest'} />
      
      <main className="flex-1 transition-all">
        <header className="py-4 px-8 bg-white border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>
        
        <div className="p-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Research Overview */}
            <div className="col-span-12 md:col-span-4">
              <InfoCard title="Research Overview">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Topic:</span>
                    <span className="text-sm font-medium">Artificial Intelligence</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Supervisor:</span>
                    <span className="text-sm font-medium">Dr. Smith</span>
                  </div>
                </div>
              </InfoCard>
            </div>
            
            {/* Exam Status */}
            <div className="col-span-12 md:col-span-4">
              <InfoCard title="Exam Status">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="text-sm font-medium">Comprehensive Exam</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <StatusBadge status="Passed" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium">2025-02-25</span>
                  </div>
                </div>
              </InfoCard>
            </div>
            
            {/* Announcements */}
            <div className="col-span-12 md:col-span-4">
              <InfoCard title="Announcements">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm">Upcoming Research Symposium</h4>
                    <p className="text-sm text-gray-600 my-1.5">
                      All PhD students are invited to participate in the annual research symposium on March 15th.
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>2025-02-28</span>
                      <span>Dr. Research Coordinator</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-600 text-sm">Publication Submission Deadline</h4>
                    <p className="text-sm text-gray-600 my-1.5">
                      The deadline for journal publications is approaching. Please submit your research papers by April 10th.
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>2025-03-01</span>
                      <span>Academic Office</span>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
            
            {/* Recent DC Meeting */}
            <div className="col-span-12">
              <InfoCard title="Recent DC Meeting">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium">2025-02-10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className="text-sm font-medium text-blue-600">Approved</span>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
