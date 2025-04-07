
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoordinatorIndex from './Index';
import { AuthContext } from '@/contexts/AuthContext';

// Mock Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate-mock">Navigate to {to}</div>,
  };
});

describe('CoordinatorIndex Component', () => {
  it('redirects to login when user is not a coordinator', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Student User',
      userId: 'user123',
      userRole: 'student',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <CoordinatorIndex />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should redirect to login
    expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Navigate to /login');
  });

  it('redirects to publications page when user is a coordinator', () => {
    const mockAuthContext = {
      isLoggedIn: true,
      isAuthenticated: true,
      userName: 'Coordinator User',
      userId: 'coord123',
      userRole: 'coordinator',
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <CoordinatorIndex />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Should redirect to publications
    expect(screen.getByTestId('navigate-mock')).toHaveTextContent('Navigate to /coordinator/publications');
  });
});
