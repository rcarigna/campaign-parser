import { render, screen, fireEvent } from '@testing-library/react';
import { ModalHeader, ModalHeaderProps } from './ModalHeader';

describe('ModalHeader', () => {
  const defaultProps: ModalHeaderProps = {
    title: 'Merge Entities',
    onClose: jest.fn(),
  };

  it('renders the title', () => {
    render(<ModalHeader {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      defaultProps.title
    );
  });

  it('renders the close button', () => {
    render(<ModalHeader {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('modal-close');
    expect(closeButton).toHaveTextContent('×');
  });

  it('calls onClose when close button is clicked', () => {
    render(<ModalHeader {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
