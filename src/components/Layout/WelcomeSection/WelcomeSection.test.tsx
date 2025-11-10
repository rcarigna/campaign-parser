import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WelcomeSection } from './WelcomeSection';
import * as toast from 'react-hot-toast';
import * as api from '@/client/api';
// Mock the API
jest.mock('@/client/api', () => ({
  loadDemoData: jest.fn().mockResolvedValue({
    filename: 'demo.md',
    type: 'markdown',
    content: { raw: '# Demo' },
    entities: [],
  }),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('WelcomeSection', () => {
  const mockOnDemoDataLoaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders demo section', () => {
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);

    expect(screen.getByText('🎭 Try the Demo')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /load demo session/i })
    ).toBeInTheDocument();
  });

  it('loads demo data when button clicked', async () => {
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);

    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });
    await userEvent.click(demoButton);

    expect(mockOnDemoDataLoaded).toHaveBeenCalled();
  });

  it('shows loading state when loading demo', async () => {
    jest
      .spyOn(api, 'loadDemoData')
      .mockImplementationOnce(() => new Promise(() => {})); // never resolves
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });

    await userEvent.click(demoButton);
    expect(screen.getByText(/loading demo/i)).toBeInTheDocument();

    expect(demoButton).toBeDisabled();
    expect(screen.getByText(/loading demo/i)).toBeInTheDocument();
  });

  it('shows success toast on successful demo load', async () => {
    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });

    await userEvent.click(demoButton);
    expect(toast.toast.success).toHaveBeenCalledWith(
      'Demo data loaded successfully!'
    );
  });

  it('shows error toast if demo load fails', async () => {
    jest
      .spyOn(api, 'loadDemoData')
      .mockRejectedValueOnce(new Error('Network error'));

    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });

    await userEvent.click(demoButton);

    await waitFor(() =>
      expect(toast.toast.error).toHaveBeenCalledWith('Network error')
    );
    expect(mockOnDemoDataLoaded).not.toHaveBeenCalled();
  });

  it('shows generic error toast if thrown error is not an Error instance', async () => {
    jest.spyOn(api, 'loadDemoData').mockRejectedValueOnce('Some error string');

    render(<WelcomeSection onDemoDataLoaded={mockOnDemoDataLoaded} />);
    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });

    await userEvent.click(demoButton);

    expect(toast.toast.error).toHaveBeenCalledWith('Failed to load demo');
    expect(mockOnDemoDataLoaded).not.toHaveBeenCalled();
  });
});
