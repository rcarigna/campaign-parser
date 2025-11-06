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

  it('renders when visible', () => {
    render(
      <WelcomeSection
        isVisible={true}
        onDemoDataLoaded={mockOnDemoDataLoaded}
      />
    );

    expect(screen.getByText('Welcome to Campaign Parser')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /load demo session/i })
    ).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(
      <WelcomeSection
        isVisible={false}
        onDemoDataLoaded={mockOnDemoDataLoaded}
      />
    );

    expect(
      screen.queryByText('Welcome to Campaign Parser')
    ).not.toBeInTheDocument();
  });

  it('loads demo data when button clicked', async () => {
    render(
      <WelcomeSection
        isVisible={true}
        onDemoDataLoaded={mockOnDemoDataLoaded}
      />
    );

    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });
    await userEvent.click(demoButton);

    expect(mockOnDemoDataLoaded).toHaveBeenCalled();
  });
});
