import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WelcomeSection } from './WelcomeSection';

// Mock the API
jest.mock('@/client/api', () => ({
  loadDemoData: jest.fn().mockResolvedValue({
    filename: 'demo.md',
    type: 'markdown',
    content: { raw: '# Demo' },
    entities: [],
  }),
}));

jest.mock('react-hot-toast');

describe('WelcomeSection', () => {
  const mockOnDemoDataLoaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders demo section', () => {
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    
    expect(screen.getByText('🎭 Try the Demo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load demo session/i })).toBeInTheDocument();
  });

  it('loads demo data when button clicked', async () => {
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    
    const demoButton = screen.getByRole('button', { name: /load demo session/i });
    await userEvent.click(demoButton);
    
    expect(mockOnDemoDataLoaded).toHaveBeenCalled();
  });
});
