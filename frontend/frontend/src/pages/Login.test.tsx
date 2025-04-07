import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '@/contexts/AuthContext';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Login Component', () => {
  const authContextValue = {
    isLoggedIn: false,
    isAuthenticated: false,
    userName: null,
    userId: null,
    userRole: null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login options', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Doctoral Progress Tracker')).toBeInTheDocument();
    expect(screen.getByText('Select Role')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Coordinator')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should handle role selection', () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Initial state - no role selected
    const signInButton = screen.getByText('Sign in');
    
    // Click student role
    fireEvent.click(screen.getByText('Student'));
    
    // Student role should be selected (indicated by blue background)
    const studentButton = screen.getByText('Student').parentElement;
    expect(studentButton).toHaveClass('bg-blue-900');
    
    // Other roles should not be selected
    const supervisorButton = screen.getByText('Supervisor').parentElement;
    const coordinatorButton = screen.getByText('Coordinator').parentElement;
    expect(supervisorButton).not.toHaveClass('bg-blue-900');
    expect(coordinatorButton).not.toHaveClass('bg-blue-900');
  });

  it('should call login and navigate when signing in', async () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Select student role
    fireEvent.click(screen.getByText('Student'));
    
    // Click sign in
    fireEvent.click(screen.getByText('Sign in'));
    
    // Check if login was called with correct params
    expect(authContextValue.login).toHaveBeenCalledWith('Bharath Nayak Bhukya', 'student');
    
    // Check navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should navigate to supervisor dashboard when signing in as supervisor', async () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Select supervisor role
    fireEvent.click(screen.getByText('Supervisor'));
    
    // Click sign in
    fireEvent.click(screen.getByText('Sign in'));
    
    // Check navigation to supervisor dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/supervisor');
    });
  });

  it('should navigate to coordinator dashboard when signing in as coordinator', async () => {
    render(
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Select coordinator role
    fireEvent.click(screen.getByText('Coordinator'));
    
    // Click sign in
    fireEvent.click(screen.getByText('Sign in'));
    
    // Check navigation to coordinator dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/coordinator');
    });
  });

  it('should redirect if already authenticated', () => {
    // Setup with authenticated user
    const authenticatedAuthContextValue = {
      ...authContextValue,
      isAuthenticated: true,
      userRole: 'student',
    };

    render(
      <AuthContext.Provider value={authenticatedAuthContextValue}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should redirect to appropriate dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
