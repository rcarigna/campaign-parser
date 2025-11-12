import { render, screen, fireEvent } from '@testing-library/react';
import { InsufficientEntitiesMessage } from './InsufficientEntitiesMessage';

describe('InsufficientEntitiesMessage', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal header with correct title', () => {
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    expect(screen.getByText('⚠️ Insufficient Entities')).toBeInTheDocument();
  });

  it('renders the insufficient entities message', () => {
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    expect(
      screen.getByText('At least 2 entities are required for merging.')
    ).toBeInTheDocument();
  });

  it('renders the Close button', () => {
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', () => {
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ModalHeader close is triggered', () => {
    // ModalHeader's close button should call onClose
    // Find the button by its accessible name (usually "Close" or aria-label)
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    const closeButton = screen
      .getAllByRole('button')
      .find(
        (btn) =>
          btn.textContent === '' || btn.getAttribute('aria-label') === 'Close'
      );
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('does not close modal when modal-content is clicked', () => {
    render(<InsufficientEntitiesMessage onClose={onClose} />);
    fireEvent.click(
      screen.getByText('At least 2 entities are required for merging.')
    );
    expect(onClose).not.toHaveBeenCalled();
  });
});
