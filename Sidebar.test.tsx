
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Test User',
  userId: 'user123',
  userRole: 'student',
  login: vi.fn(),
  logout: vi.fn(),
};

describe('Sidebar Component', () => {
  it('renders sidebar with correct navigation items', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <Sidebar userName="Test User" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for portal title
    expect(screen.getByText('Student Portal')).toBeInTheDocument();
    
    // Check for username
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('DC Meeting')).toBeInTheDocument();
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Exams')).toBeInTheDocument();
    
    // Check for logout button
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <Sidebar userName="Test User" />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();
    
    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
  });
});
