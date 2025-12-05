import { render, screen } from '@testing-library/react';
import { WelcomeHeader } from './WelcomeHeader';

describe('WelcomeHeader', () => {
  it('renders the emoji', () => {
    render(<WelcomeHeader />);
    expect(screen.getByText('📜')).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<WelcomeHeader />);
    expect(
      screen.getByRole('heading', { name: /welcome to campaign parser/i })
    ).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    render(<WelcomeHeader />);
    expect(screen.getByText(/upload campaign documents/i)).toBeInTheDocument();
    expect(
      screen.getByText(/identify and extract entities/i)
    ).toBeInTheDocument();
  });

  it('has correct class names for layout and style', () => {
    render(<WelcomeHeader />);
    const container = screen.getByText('📜').parentElement;
    expect(container).toHaveClass('text-center', 'mb-8');
    expect(screen.getByText('📜')).toHaveClass('text-6xl', 'mb-4');
    expect(
      screen.getByRole('heading', { name: /welcome to campaign parser/i })
    ).toHaveClass('text-2xl', 'font-semibold', 'text-gray-800', 'mb-4');
    expect(screen.getByText(/upload campaign documents/i)).toHaveClass(
      'text-gray-600',
      'max-w-2xl',
      'mx-auto',
      'mb-6'
    );
  });
});
