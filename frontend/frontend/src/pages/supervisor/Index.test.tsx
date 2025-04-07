
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupervisorDashboard from './Index';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Dr. Smith',
  userId: 'supervisor123',
  userRole: 'supervisor',
  login: vi.fn(),
  logout: vi.fn(),
};

describe('SupervisorDashboard Component', () => {
  it('renders supervisor dashboard with student statistics', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <SupervisorDashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for dashboard title
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check for student statistics section
    expect(screen.getByText('Student Statistics')).toBeInTheDocument();
    
    // Check for student count
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Total Ph.D. Students')).toBeInTheDocument();
    
    // Check for meeting approvals section
    expect(screen.getByText('DC Meeting Approvals')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    
    // Check for publication status section
    expect(screen.getByText('Publication Status')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Conference')).toBeInTheDocument();
  });
});
