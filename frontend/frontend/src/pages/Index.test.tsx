
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Index';
import { AuthContext } from '@/contexts/AuthContext';

// Mock SupervisorDashboard component
vi.mock('./supervisor/Index', () => ({
  default: () => <div data-testid="supervisor-dashboard">Supervisor Dashboard</div>
}));

describe('Dashboard Component', () => {
  it('renders student dashboard when user is a student', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Student Name',
      userId: 'student123',
      userRole: 'student',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render student dashboard components
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Research Overview')).toBeInTheDocument();
    expect(screen.getByText('Exam Status')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();
    expect(screen.getByText('Recent DC Meeting')).toBeInTheDocument();
    
    // Should show specific student data
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Exam')).toBeInTheDocument();
    
    // Should not render supervisor dashboard
    expect(screen.queryByTestId('supervisor-dashboard')).not.toBeInTheDocument();
  });

  it('renders supervisor dashboard when user is a supervisor', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Dr. Supervisor',
      userId: 'supervisor123',
      userRole: 'supervisor',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render supervisor dashboard
    expect(screen.getByTestId('supervisor-dashboard')).toBeInTheDocument();
    
    // Should not render student dashboard content
    expect(screen.queryByText('Research Overview')).not.toBeInTheDocument();
    expect(screen.queryByText('Artificial Intelligence')).not.toBeInTheDocument();
  });
});
