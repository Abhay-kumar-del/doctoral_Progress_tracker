
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoordinatorDashboardLayout from './CoordinatorDashboardLayout';
import { AuthContext } from '@/contexts/AuthContext';

// Mock child component
const MockChild = () => <div data-testid="mock-child">Mock Child Content</div>;

// Mock the AuthContext
const mockAuthContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Dr. Jones',
  userId: 'coordinator123',
  userRole: 'coordinator',
  login: vi.fn(),
  logout: vi.fn(),
};

// Mock CoordinatorSidebar
vi.mock('./CoordinatorSidebar', () => ({
  default: ({ userName }) => <div data-testid="coordinator-sidebar">{userName}</div>
}));

describe('CoordinatorDashboardLayout Component', () => {
  it('renders coordinator dashboard layout correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <CoordinatorDashboardLayout>
            <MockChild />
          </CoordinatorDashboardLayout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render coordinator sidebar
    expect(screen.getByTestId('coordinator-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('coordinator-sidebar')).toHaveTextContent('Dr. Jones');
    
    // Should render child content
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });
});
