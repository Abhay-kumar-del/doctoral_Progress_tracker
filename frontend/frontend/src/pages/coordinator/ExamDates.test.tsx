
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExamDates from './ExamDates';
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
        title: 'Comprehensive Exam',
        date: '2024-05-15',
        location: 'Room A101',
        description: 'Comprehensive examination for first-year PhD students',
      },
      {
        id: '2',
        title: 'Qualifying Exam',
        date: '2024-06-10',
        location: 'Conference Hall',
        description: 'Qualifying examination for second-year PhD students',
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

describe('ExamDates Component', () => {
  it('renders exam dates list correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <ExamDates />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check for page title
    expect(screen.getByText('Exam Dates')).toBeInTheDocument();
    
    // Check for 'Add New Exam Date' button
    expect(screen.getByText('Add New Exam Date')).toBeInTheDocument();
    
    // Check for exam dates in the list
    expect(screen.getByText('Comprehensive Exam')).toBeInTheDocument();
    expect(screen.getByText('Qualifying Exam')).toBeInTheDocument();
    
    // Check for date and location information
    expect(screen.getByText('Location: Room A101')).toBeInTheDocument();
    expect(screen.getByText('Location: Conference Hall')).toBeInTheDocument();
  });
});
