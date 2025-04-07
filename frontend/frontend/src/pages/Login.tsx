
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

type Role = 'student' | 'supervisor' | 'coordinator' | null;

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'supervisor') {
        navigate('/supervisor');
      } else if (userRole === 'coordinator') {
        navigate('/coordinator');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, userRole]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleSignIn = async () => {
    if (!selectedRole) {
      toast({
        title: "Role Required",
        description: "Please select a role before signing in",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Always use Bharath Nayak Bhukya as the name
      login("Bharath Nayak Bhukya", selectedRole);
      
      toast({
        title: "Sign in successful",
        description: `Signed in as ${selectedRole}`,
      });

      // Redirect based on role
      if (selectedRole === 'supervisor') {
        navigate('/supervisor');
      } else if (selectedRole === 'coordinator') {
        navigate('/coordinator');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          
          <Button 
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full"
            variant="default"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Need help? Contact your administrator
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
