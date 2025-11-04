import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from './ActionButtons';

describe('ActionButtons', () => {
  const mockOnProcess = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty actions div when no file is selected', () => {
    const { container } = render(
      <ActionButtons
        selectedFile={null}
        loading={false}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const actionsDiv = container.querySelector('.actions');
    expect(actionsDiv).toHaveClass('actions');
    expect(actionsDiv).toBeEmptyDOMElement();
  });

  it('should render process and reset buttons when file is selected', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={false}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Parse Document')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should enable process button when file is selected', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={false}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const processButton = screen.getByText('Parse Document');
    expect(processButton).toBeEnabled();
  });

  it('should disable process button when loading', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={true}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const processButton = screen.getByText('Parsing...');
    expect(processButton).toBeDisabled();
  });

  it('should call onProcess when process button is clicked', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={false}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const processButton = screen.getByText('Parse Document');
    fireEvent.click(processButton);

    expect(mockOnProcess).toHaveBeenCalledTimes(1);
    expect(mockOnProcess).toHaveBeenCalledWith(mockFile);
  });

  it('should call onReset when reset button is clicked', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={false}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should show loading text when processing', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={true}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Parsing...')).toBeInTheDocument();
    expect(screen.queryByText('Parse Document')).not.toBeInTheDocument();
  });

  it('should always enable reset button regardless of loading state', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    render(
      <ActionButtons
        selectedFile={mockFile}
        loading={true}
        onProcess={mockOnProcess}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeEnabled();
  });
});
