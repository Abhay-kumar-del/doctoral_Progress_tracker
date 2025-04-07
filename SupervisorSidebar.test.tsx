
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupervisorSidebar from './SupervisorSidebar';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Dr. Supervisor',
  userId: 'supervisor123',
  userRole: 'supervisor',
  login: vi.fn(),
  logout: vi.fn(),
};

describe('SupervisorSidebar Component', () => {
  it('renders supervisor sidebar with correct navigation items', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <SupervisorSidebar userName="Dr. Supervisor" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for portal title
    expect(screen.getByText('Supervisor Portal')).toBeInTheDocument();
    
    // Check for username
    expect(screen.getByText('Dr. Supervisor')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Students')).toBeInTheDocument();
    expect(screen.getByText('DC Meetings')).toBeInTheDocument();
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(screen.getByText('Exam Requests')).toBeInTheDocument();
    
    // Check for logout button
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <SupervisorSidebar userName="Dr. Supervisor" />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();
    
    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
  });
});
