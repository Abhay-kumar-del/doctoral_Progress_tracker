
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { AuthContext } from '@/contexts/AuthContext';

// Mock child component
const MockChild = () => <div data-testid="mock-child">Mock Child Content</div>;

// Mock the AuthContext for student
const mockStudentContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Student Name',
  userId: 'student123',
  userRole: 'student',
  login: vi.fn(),
  logout: vi.fn(),
};

// Mock the AuthContext for supervisor
const mockSupervisorContext = {
  isLoggedIn: true,
  isAuthenticated: true,
  userName: 'Supervisor Name',
  userId: 'supervisor123',
  userRole: 'supervisor',
  login: vi.fn(),
  logout: vi.fn(),
};

// Mock Sidebar and SupervisorSidebar
vi.mock('./Sidebar', () => ({
  default: ({ userName }) => <div data-testid="student-sidebar">{userName}</div>
}));

vi.mock('./SupervisorSidebar', () => ({
  default: ({ userName }) => <div data-testid="supervisor-sidebar">{userName}</div>
}));

describe('DashboardLayout Component', () => {
  it('renders student sidebar when user role is student', () => {
    render(
      <AuthContext.Provider value={mockStudentContext}>
        <MemoryRouter>
          <DashboardLayout>
            <MockChild />
          </DashboardLayout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render student sidebar
    expect(screen.getByTestId('student-sidebar')).toBeInTheDocument();
    
    // Should not render supervisor sidebar
    expect(screen.queryByTestId('supervisor-sidebar')).not.toBeInTheDocument();
    
    // Should render child content
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });

  it('renders supervisor sidebar when user role is supervisor', () => {
    render(
      <AuthContext.Provider value={mockSupervisorContext}>
        <MemoryRouter>
          <DashboardLayout>
            <MockChild />
          </DashboardLayout>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render supervisor sidebar
    expect(screen.getByTestId('supervisor-sidebar')).toBeInTheDocument();
    
    // Should not render student sidebar
    expect(screen.queryByTestId('student-sidebar')).not.toBeInTheDocument();
    
    // Should render child content
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });
});
