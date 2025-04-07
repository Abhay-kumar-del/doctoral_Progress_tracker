
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoordinatorSidebar from './CoordinatorSidebar';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Dr. Coordinator',
  userId: 'coordinator123',
  userRole: 'coordinator',
  login: vi.fn(),
  logout: vi.fn(),
};

describe('CoordinatorSidebar Component', () => {
  it('renders coordinator sidebar with correct navigation items', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <CoordinatorSidebar userName="Dr. Coordinator" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for portal title
    expect(screen.getByText('Coordinator Portal')).toBeInTheDocument();
    
    // Check for username
    expect(screen.getByText('Dr. Coordinator')).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText('Research Publications')).toBeInTheDocument();
    expect(screen.getByText('Exam Results')).toBeInTheDocument();
    expect(screen.getByText('SWAYAM Courses')).toBeInTheDocument();
    expect(screen.getByText('Exam Dates')).toBeInTheDocument();
    
    // Check for logout button
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <CoordinatorSidebar userName="Dr. Coordinator" />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();
    
    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
  });
});
