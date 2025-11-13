import { render, screen } from '@testing-library/react';
import { ModalFooter } from './ModalFooter';
import userEvent from '@testing-library/user-event';
import { ModalFooterProps } from '@/types';

const defaultProps: ModalFooterProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  confirmLabel: 'Merge',
};

describe('ModalFooter', () => {
  it('renders confirm and cancel buttons with correct labels', () => {
    render(<ModalFooter {...defaultProps} />);
    expect(screen.getByText('Merge')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom cancel label if provided', () => {
    render(<ModalFooter {...defaultProps} cancelLabel='Dismiss' />);
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<ModalFooter {...defaultProps} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    render(<ModalFooter {...defaultProps} />);
    await userEvent.click(screen.getByText('Merge'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables confirm button when disabled prop is true', () => {
    render(<ModalFooter {...defaultProps} disabled />);
    expect(screen.getByText('Merge')).toBeDisabled();
  });

  it('confirm button is enabled by default', () => {
    render(<ModalFooter {...defaultProps} />);
    expect(screen.getByText('Merge')).not.toBeDisabled();
  });
});
