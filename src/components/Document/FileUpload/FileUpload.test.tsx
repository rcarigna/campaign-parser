import { render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from './FileUpload';

const mockOnFileSelect = jest.fn();

const defaultProps = {
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
    expect(screen.getByText(errorMessage)).toHaveClass('error');
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

  it('applies drag-over class when dragging over upload area', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen
      .getByText('Click to select a file or drag and drop')
      .closest('.upload-area');

    fireEvent.dragOver(uploadArea!, { preventDefault: jest.fn() });

    expect(uploadArea).toHaveClass('drag-over');
  });

  it('removes drag-over class when drag leaves upload area', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen
      .getByText('Click to select a file or drag and drop')
      .closest('.upload-area');

    fireEvent.dragOver(uploadArea!, { preventDefault: jest.fn() });
    expect(uploadArea).toHaveClass('drag-over');

    fireEvent.dragLeave(uploadArea!, { preventDefault: jest.fn() });
    expect(uploadArea).not.toHaveClass('drag-over');
  });

  it('calls onFileSelect when file is dropped', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen
      .getByText('Click to select a file or drag and drop')
      .closest('.upload-area');
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    fireEvent.drop(uploadArea!, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [mockFile] },
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith(mockFile);
  });

  it('removes drag-over class after drop', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen
      .getByText('Click to select a file or drag and drop')
      .closest('.upload-area');
    const mockFile = new File(['content'], 'test.md', {
      type: 'text/markdown',
    });

    fireEvent.dragOver(uploadArea!, { preventDefault: jest.fn() });
    expect(uploadArea).toHaveClass('drag-over');

    fireEvent.drop(uploadArea!, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [mockFile] },
    });

    expect(uploadArea).not.toHaveClass('drag-over');
  });

  it('handles empty file drop gracefully', () => {
    render(<FileUpload {...defaultProps} />);

    const uploadArea = screen
      .getByText('Click to select a file or drag and drop')
      .closest('.upload-area');

    fireEvent.drop(uploadArea!, {
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
});
