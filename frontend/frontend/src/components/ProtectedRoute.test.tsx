
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '@/contexts/AuthContext';

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: () => <div data-testid="navigate-mock">Navigate Mock</div>,
  };
});

// Mock child component
const MockChild = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute Component', () => {
  it('redirects to login when user is not authenticated', () => {
    const mockAuthContext = {
      isLoggedIn: false,
      isAuthenticated: false,
      userName: null,
      userId: null,
      userRole: null,
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ProtectedRoute>
            <MockChild />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should redirect to login
    expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
    
    // Should not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders protected content when user is authenticated with matching role', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Test User',
      userId: 'user123',
      userRole: 'supervisor',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="supervisor">
            <MockChild />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should render protected content
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects when user role does not match required role', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Test User',
      userId: 'user123',
      userRole: 'student',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ProtectedRoute requiredRole="supervisor">
            <MockChild />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should redirect
    expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
    
    // Should not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
