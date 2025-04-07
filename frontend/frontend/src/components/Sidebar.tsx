
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileCheck, 
  FileText, 
  BookOpen, 
  CalendarClock,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  userName: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, className }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileCheck, label: 'DC Meeting', path: '/dc-meeting' },
    { icon: FileText, label: 'Publications', path: '/publications' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: CalendarClock, label: 'Exams', path: '/exams' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("bg-white border-r border-gray-100 w-[220px] flex flex-col transition-all", className)}>
        <div className="p-6 border-b border-gray-100 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-blue-600">Student Portal</h2>
          <p className="text-sm text-gray-500 mt-1">{userName}</p>
        </div>
        
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-blue-50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2.5 rounded-lg transition-all bg-red-50 text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 bg-white border-r border-gray-100 w-[250px] flex flex-col transition-all duration-300 transform z-50 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-gray-100 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-blue-600">Student Portal</h2>
          <p className="text-sm text-gray-500 mt-1">{userName}</p>
        </div>
        
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-blue-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2.5 rounded-lg transition-all bg-red-50 text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
