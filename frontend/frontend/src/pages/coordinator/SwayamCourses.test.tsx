
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SwayamCourses from './SwayamCourses';
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

// Mock dialog component
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog">{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-trigger">{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>,
}));

// Mock the query client
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: [
      {
        id: '1',
        name: 'Introduction to Machine Learning',
        provider: 'NPTEL',
        duration: '12 weeks',
        description: 'Learn the fundamentals of machine learning',
      },
      {
        id: '2',
        name: 'Advanced Database Systems',
        provider: 'IIT Bombay',
        duration: '8 weeks',
        description: 'Advanced concepts in database management',
      }
    ],
    isLoading: false,
    error: null,
  }),
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

describe('SwayamCourses Component', () => {
  it('renders SWAYAM courses list correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <SwayamCourses />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for page title
    expect(screen.getByText('SWAYAM Courses')).toBeInTheDocument();
    
    // Check for 'Add New Course' button
    expect(screen.getByText('Add New Course')).toBeInTheDocument();
    
    // Check for course items in the list
    expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument();
    expect(screen.getByText('Advanced Database Systems')).toBeInTheDocument();
    
    // Check for provider information
    expect(screen.getByText('NPTEL')).toBeInTheDocument();
    expect(screen.getByText('IIT Bombay')).toBeInTheDocument();
  });
});
