
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupervisorDashboardLayout from './SupervisorDashboardLayout';
import { AuthContext } from '@/contexts/AuthContext';

// Mock child component
const MockChild = () => <div data-testid="mock-child">Mock Child Content</div>;

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

// Mock SupervisorSidebar
vi.mock('./SupervisorSidebar', () => ({
  default: ({ userName }) => <div data-testid="supervisor-sidebar">{userName}</div>
}));

describe('SupervisorDashboardLayout Component', () => {
  it('renders supervisor dashboard layout correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <SupervisorDashboardLayout>
            <MockChild />
          </SupervisorDashboardLayout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render supervisor sidebar
    expect(screen.getByTestId('supervisor-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('supervisor-sidebar')).toHaveTextContent('Dr. Smith');
    
    // Should render child content
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });
});
