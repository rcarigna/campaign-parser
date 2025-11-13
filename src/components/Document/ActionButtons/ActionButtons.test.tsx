import { render, screen } from '@testing-library/react';
import { ActionButtons } from './ActionButtons';
import { ActionButtonsProps } from '@/types';
import userEvent from '@testing-library/user-event';

describe('ActionButtons', () => {
  const mockOnProcess = jest.fn();
  const mockOnReset = jest.fn();
  const mockProps: ActionButtonsProps = {
    selectedFile: null,
    loading: false,
    onProcess: mockOnProcess,
    onReset: mockOnReset,
  };

  const markdownMock = new File(['content'], 'test.md', {
    type: 'text/markdown',
  });

  const markdownProps = {
    ...mockProps,
    selectedFile: markdownMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty actions div when no file is selected', () => {
    const { container } = render(<ActionButtons {...mockProps} />);

    const actionsDiv = container.querySelector('.actions');
    expect(actionsDiv).toHaveClass('actions');
    expect(actionsDiv).toBeEmptyDOMElement();
  });

  it('should render process and reset buttons when file is selected', () => {
    render(<ActionButtons {...mockProps} selectedFile={markdownMock} />);

    expect(screen.getByText('Parse Document')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should enable process button when file is selected', () => {
    render(<ActionButtons {...markdownProps} />);

    const processButton = screen.getByText('Parse Document');
    expect(processButton).toBeEnabled();
  });

  it('should disable process button when loading', () => {
    render(<ActionButtons {...markdownProps} loading={true} />);

    const processButton = screen.getByText('Parsing...');
    expect(processButton).toBeDisabled();
  });

  it('should call onProcess when process button is clicked', async () => {
    render(<ActionButtons {...markdownProps} />);

    const processButton = screen.getByText('Parse Document');
    await userEvent.click(processButton);

    expect(mockOnProcess).toHaveBeenCalledTimes(1);
    expect(mockOnProcess).toHaveBeenCalledWith(markdownMock);
  });

  it('should call onReset when reset button is clicked', async () => {
    render(<ActionButtons {...markdownProps} />);

    const resetButton = screen.getByText('Reset');
    await userEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should show loading text when processing', () => {
    render(<ActionButtons {...markdownProps} loading={true} />);

    expect(screen.getByText('Parsing...')).toBeInTheDocument();
    expect(screen.queryByText('Parse Document')).not.toBeInTheDocument();
  });

  it('should always enable reset button regardless of loading state', () => {
    render(<ActionButtons {...markdownProps} loading={true} />);

    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeEnabled();
  });
});
