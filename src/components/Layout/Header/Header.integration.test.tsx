import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

// Mock window.open to avoid actual navigation in tests
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', { value: mockOpen });

describe('Header with Documentation Integration', () => {
  const defaultProps = {
    title: 'Campaign Document Parser',
    subtitle: 'Upload documents to extract entities',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation menu with documentation links', () => {
    render(<Header {...defaultProps} />);

    // Check if navigation items are present
    expect(screen.getByTitle('Documentation')).toBeInTheDocument();
    expect(screen.getByTitle('API Reference')).toBeInTheDocument();
    expect(screen.getByTitle('GitHub')).toBeInTheDocument();
    expect(screen.getByTitle('Architecture')).toBeInTheDocument();
  });

  it('opens documentation modal when documentation button is clicked', () => {
    render(<Header {...defaultProps} />);

    const docButton = screen.getByTitle('Documentation');
    fireEvent.click(docButton);

    // Check if modal opened
    expect(screen.getByText('📚 Documentation')).toBeInTheDocument();
    expect(screen.getByText('🚀 Quick Start Guide')).toBeInTheDocument();
  });

  it('navigates through documentation tabs', () => {
    render(<Header {...defaultProps} />);

    // Open documentation modal
    const docButton = screen.getByTitle('Documentation');
    fireEvent.click(docButton);

    // Switch to features tab
    const featuresTab = screen.getByText('⚡ Key Features');
    fireEvent.click(featuresTab);

    expect(screen.getByText('🧠 Smart Entity Extraction')).toBeInTheDocument();

    // Switch to troubleshooting tab
    const troubleshootingTab = screen.getByText('🔧 Troubleshooting');
    fireEvent.click(troubleshootingTab);

    expect(screen.getByText('File Upload Issues')).toBeInTheDocument();
  });

  it('closes documentation modal when close button is clicked', () => {
    render(<Header {...defaultProps} />);

    // Open modal
    const docButton = screen.getByTitle('Documentation');
    fireEvent.click(docButton);

    // Close modal
    const closeButton = screen.getByLabelText('Close documentation');
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByText('📚 Documentation')).not.toBeInTheDocument();
  });

  it('opens external links for API Reference and GitHub', () => {
    render(<Header {...defaultProps} />);

    // Click API Reference
    const apiButton = screen.getByTitle('API Reference');
    fireEvent.click(apiButton);

    expect(mockOpen).toHaveBeenCalledWith(
      '/api/docs?file=api-reference',
      '_blank',
      'noopener,noreferrer'
    );

    // Click GitHub
    const githubButton = screen.getByTitle('GitHub');
    fireEvent.click(githubButton);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://github.com/rcarigna/campaign-parser',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('includes proper navigation icons and labels', () => {
    render(<Header {...defaultProps} />);

    // Check for icons (emojis) in navigation
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('🔌')).toBeInTheDocument();
    expect(screen.getByText('🐙')).toBeInTheDocument();
    expect(screen.getByText('🏗️')).toBeInTheDocument();
  });

  it('hides navigation labels on small screens but shows icons', () => {
    render(<Header {...defaultProps} />);

    // Navigation items should have responsive classes
    const docButton = screen.getByTitle('Documentation');
    expect(docButton.querySelector('.hidden')).toBeInTheDocument();
    expect(docButton.querySelector('.sm\\:inline')).toBeInTheDocument();
  });
});
