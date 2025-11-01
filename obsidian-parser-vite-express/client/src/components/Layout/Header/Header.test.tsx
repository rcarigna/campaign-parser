import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
  };

  it('renders the title correctly', () => {
    render(<Header {...defaultProps} />);

    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Test Title');
  });

  it('renders the subtitle correctly', () => {
    render(<Header {...defaultProps} />);

    const subtitleElement = screen.getByText('Test Subtitle');
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement.tagName).toBe('P');
  });

  it('renders header element with correct structure', () => {
    render(<Header {...defaultProps} />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
    expect(headerElement.tagName).toBe('HEADER');
  });

  it('handles empty title and subtitle', () => {
    render(<Header title='' subtitle='' />);

    const titleElement = screen.getByRole('heading', { level: 1 });
    const subtitleElement = screen.getByRole('paragraph');

    expect(titleElement).toHaveTextContent('');
    expect(subtitleElement).toHaveTextContent('');
  });
});
