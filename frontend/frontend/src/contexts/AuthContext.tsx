
import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  isAuthenticated: boolean; // Add this property
  userName: string | null;
  userId: string | null;
  userRole: string | null;
  login: (username: string, role: string) => void; // Updated parameter list
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAuthenticated: false, // Add this property
  userName: null,
  userId: null,
  userRole: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserName(userData.name);
      setUserRole(userData.role);
      setUserId(userData.id || `user-${Date.now()}`); // Generate an ID if one doesn't exist
    }
  }, []);
  
  const login = (username: string, role: string) => {
    // In a real app, validate credentials here
    const userId = `user-${Date.now()}`;
    
    // Store user data
    const userData = {
      name: username,
      role: role,
      id: userId
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setIsLoggedIn(true);
    setUserName(username);
    setUserRole(role);
    setUserId(userId);
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
    setUserId(null);
  };
  
  const authContextValue = {
    isLoggedIn,
    isAuthenticated: isLoggedIn, // Map isLoggedIn to isAuthenticated
    userName,
    userRole,
    userId,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
