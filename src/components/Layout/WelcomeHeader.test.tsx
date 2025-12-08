import { render, screen } from '@testing-library/react';
import { WelcomeHeader } from './WelcomeHeader';

describe('WelcomeHeader', () => {
  it('renders the main heading', () => {
    render(<WelcomeHeader />);
    expect(
      screen.getByRole('heading', { name: /📜 welcome to campaign parser/i })
    ).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    render(<WelcomeHeader />);
    expect(screen.getByText(/upload campaign documents/i)).toBeInTheDocument();
    expect(
      screen.getByText(/identify and extract entities/i)
    ).toBeInTheDocument();
  });
});
