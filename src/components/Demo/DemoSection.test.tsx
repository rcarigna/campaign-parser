import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DemoSection } from './DemoSection';
import * as api from '@/client/api';

// Mock the API
jest.mock('@/client/api');
jest.mock('react-hot-toast');

const mockLoadDemoData = api.loadDemoData as jest.MockedFunction<
  typeof api.loadDemoData
>;

describe('DemoSection', () => {
  const mockDemoData = {
    type: 'markdown',
    content: {
      raw: '# Test Session',
      metadata: {},
    },
    rawMarkdown: '# Test Session\n\nThis is a test session.',
    entities: [
      {
        kind: 'npc',
        title: 'Test NPC',
        role: 'Warrior',
        importance: 'major',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the demo section with load button', () => {
    render(<DemoSection />);

    expect(screen.getByText('🎭 Try the Demo')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /load example session/i })
    ).toBeInTheDocument();
  });

  it('loads demo data when button is clicked', async () => {
    mockLoadDemoData.mockResolvedValue(mockDemoData as never);

    render(<DemoSection />);

    const loadButton = screen.getByRole('button', {
      name: /load example session/i,
    });
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(mockLoadDemoData).toHaveBeenCalled();
    });
  });

  it('shows loading state while loading demo data', async () => {
    mockLoadDemoData.mockImplementation(() => new Promise(() => {}));

    render(<DemoSection />);

    const loadButton = screen.getByRole('button', {
      name: /load example session/i,
    });
    await userEvent.click(loadButton);

    expect(screen.getByText(/loading demo/i)).toBeInTheDocument();
  });

  it('displays demo content after loading', async () => {
    mockLoadDemoData.mockResolvedValue(mockDemoData as never);

    render(<DemoSection />);

    const loadButton = screen.getByRole('button', {
      name: /load example session/i,
    });
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(screen.getByText('📄 Session Notes')).toBeInTheDocument();
      expect(screen.getByText('✨ Extracted Entities')).toBeInTheDocument();
    });
  });

  it('allows toggling between formatted and raw markdown', async () => {
    mockLoadDemoData.mockResolvedValue(mockDemoData as never);

    render(<DemoSection />);

    const loadButton = screen.getByRole('button', {
      name: /load example session/i,
    });
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /formatted/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /raw markdown/i })
      ).toBeInTheDocument();
    });

    const rawButton = screen.getByRole('button', { name: /raw markdown/i });
    await userEvent.click(rawButton);

    // Check that the markdown is displayed in a pre tag
    await waitFor(() => {
      const preElement = document.querySelector('pre');
      expect(preElement).toBeInTheDocument();
      expect(preElement?.textContent).toContain('Test Session');
    });
  });

  it('clears demo when clear button is clicked', async () => {
    mockLoadDemoData.mockResolvedValue(mockDemoData as never);

    render(<DemoSection />);

    const loadButton = screen.getByRole('button', {
      name: /load example session/i,
    });
    await userEvent.click(loadButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /clear demo/i })
      ).toBeInTheDocument();
    });

    const clearButton = screen.getByRole('button', { name: /clear demo/i });
    await userEvent.click(clearButton);

    expect(screen.queryByText('📄 Session Notes')).not.toBeInTheDocument();
  });
});
