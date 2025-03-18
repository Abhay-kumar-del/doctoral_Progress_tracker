
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

type Role = 'student' | 'supervisor' | 'coordinator' | null;

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleGoogleSignIn = () => {
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select a role before signing in",
        variant: "destructive",
      });
      return;
    }

    // Perform login through our AuthContext
    login('Abhay Kumar', selectedRole);
    
    toast({
      title: "Sign in successful",
      description: `Signed in as ${selectedRole}`,
    });
    
    // Redirect to dashboard
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-500">Doctoral Progress Tracker</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl text-center font-medium text-gray-700">Select Role</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <button
                onClick={() => handleRoleSelect('student')}
                className={`py-3 px-4 rounded-lg transition-colors ${
                  selectedRole === 'student' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSelect('supervisor')}
                className={`py-3 px-4 rounded-lg transition-colors ${
                  selectedRole === 'supervisor' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Supervisor
              </button>
              <button
                onClick={() => handleRoleSelect('coordinator')}
                className={`py-3 px-4 rounded-lg transition-colors ${
                  selectedRole === 'coordinator' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Coordinator
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 mr-3 text-blue-500 flex items-center justify-center border border-blue-500 rounded-full">
                <span className="text-blue-500 text-sm font-bold">G</span>
              </div>
              <span className="text-gray-700">Sign in with Google</span>
            </div>
          </button>
          
          <div className="text-center text-sm text-gray-500">
            Need help? Contact your administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
