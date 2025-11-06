import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProcessingWorkflow } from './ProcessingWorkflow';

jest.mock('@/components', () => ({
  FileUpload: ({ selectedFile }: { selectedFile?: File | null }) => (
    <div data-testid='file-upload'>{selectedFile?.name || 'No file'}</div>
  ),
  ActionButtons: () => <div data-testid='action-buttons'>Action Buttons</div>,
}));

jest.mock('@/types', () => ({
  ALLOWED_EXTENSIONS: ['.docx', '.md'],
}));

describe('ProcessingWorkflow', () => {
  const defaultProps = {
    selectedFile: null,
    loading: false,
    error: null,
    onFileSelect: jest.fn(),
    onProcess: jest.fn(),
    onReset: jest.fn(),
    onClearError: jest.fn(),
  };

  it('renders file upload section', () => {
    render(<ProcessingWorkflow {...defaultProps} />);

    expect(screen.getByText('📤 Upload Document')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('shows action buttons when file is selected', () => {
    const file = new File(['test'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    render(<ProcessingWorkflow {...defaultProps} selectedFile={file} />);

    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ProcessingWorkflow {...defaultProps} loading={true} />);

    expect(screen.getByText(/processing document/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<ProcessingWorkflow {...defaultProps} error='Test error' />);

    expect(screen.getByText('❌ Error:')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
