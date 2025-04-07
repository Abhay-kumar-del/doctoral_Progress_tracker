
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Publications from './Publications';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Coordinator Publications Component', () => {
  it('renders the publications table with headers and data', () => {
    render(
      <MemoryRouter>
        <Publications />
      </MemoryRouter>
    );

    // Check page title
    expect(screen.getByText('PhD Coordinator Dashboard')).toBeInTheDocument();
    
    // Check navigation tabs
    expect(screen.getByText('Research Publications')).toBeInTheDocument();
    expect(screen.getByText('Exam Results')).toBeInTheDocument();
    expect(screen.getByText('SWAYAM Courses')).toBeInTheDocument();
    expect(screen.getByText('Exam Dates')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Publication Title')).toBeInTheDocument();
    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    
    // Check some of the publication data
    expect(screen.getByText('Abhay Kumar')).toBeInTheDocument();
    expect(screen.getByText('Advanced Machine Learning Techniques')).toBeInTheDocument();
    expect(screen.getByText('IEEE Conference')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('navigates back to dashboard when back button is clicked', () => {
    render(
      <MemoryRouter>
        <Publications />
      </MemoryRouter>
    );
    
    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/coordinator');
  });
});
