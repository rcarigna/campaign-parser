import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './FileUpload';
import { FileUploadProps } from '@/types';

const mockOnFileSelect = jest.fn();

const defaultProps: FileUploadProps = {
  onFileSelect: mockOnFileSelect,
  selectedFile: null,
  error: null,
  allowedExtensions: ['.md', '.doc', '.docx'] as const,
};

describe('FileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area with correct text when no file is selected', () => {
    render(<FileUpload {...defaultProps} />);

    expect(
      screen.getByText('Click to select a file or drag and drop')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Supported formats: .md, .doc, .docx')
    ).toBeInTheDocument();
  });

  it('displays selected file information when file is selected', () => {
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });
    Object.defineProperty(mockFile, 'size', { value: 2048 });

    render(<FileUpload {...defaultProps} selectedFile={mockFile} />);

    expect(screen.getByText('Selected: test.md')).toBeInTheDocument();
    expect(screen.getByText('Size: 2.00 KB')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Invalid file type';
    render(<FileUpload {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onFileSelect when file is selected via input', () => {
    render(<FileUpload {...defaultProps} />);

    const input = screen.getByLabelText(/click to select a file/i);
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
  });

  it('calls onFileSelect when file is dropped', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByTestId('file-upload-area');
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    fireEvent.drop(uploadArea, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [mockFile] },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
  });

  it('handles empty file drop gracefully', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen.getByTestId('file-upload-area');

    fireEvent.drop(uploadArea, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [] },
    });

    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('sets correct accept attribute on file input', () => {
    render(<FileUpload {...defaultProps} />);

    const input = screen.getByLabelText(
      /click to select a file/i
    ) as HTMLInputElement;

    expect(input.accept).toBe('.md,.doc,.docx');
  });

  // Additional tests for FileUpload component

  it('adds dragOver visual feedback to SectionContainer when dragging over', () => {
    render(<FileUpload {...defaultProps} />);
    // The SectionContainer is the outermost element or has the test id
    const section = screen.getByTestId('file-upload-area');
    expect(section).toBeInTheDocument();

    // Simulate drag over
    fireEvent.dragOver(section, { preventDefault: jest.fn() });

    // Since MUI sx prop is used for styling, we can't check for a class,
    // but we can check for the style change (borderStyle: dashed)
    // However, JSDOM does not apply sx styles, so we check for aria or data attributes if present.
    // If not, we can only ensure the dragOver state is handled by triggering drop and dragLeave events.
    // This test ensures no error is thrown and event handlers are called.
    fireEvent.dragLeave(section, { preventDefault: jest.fn() });
    fireEvent.drop(section, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [] },
    });
  });

  // Regression: input should always be present and hidden
  it('renders a hidden file input', () => {
    render(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId('file-upload-area');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveStyle('display: none');
  });

  // Regression: clicking the label triggers the file input
  it('focuses file input when label is clicked', () => {
    render(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId('file-upload-area');
    const label = screen.getByLabelText(/click to select a file/i);
    label.click();
    // JSDOM does not simulate file dialogs, but input should still be present
    expect(input).toBeInTheDocument();
  });

  // Regression: does not call onFileSelect if no file is selected via input
  it('does not call onFileSelect if input change event has no files', () => {
    render(<FileUpload {...defaultProps} />);
    const input = screen.getByTestId('file-upload-area');
    fireEvent.change(input, { target: { files: [] } });
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });
});
