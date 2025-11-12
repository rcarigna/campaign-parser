import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProcessingWorkflow } from './ProcessingWorkflow';
import { mockFileDocx, mockFileMd } from '../../__mocks__/mockedDocuments';
import { ProcessingWorkflowProps } from '@/types';

jest.mock('@/components', () => ({
  FileUpload: ({ selectedFile }: { selectedFile?: File | null }) => (
    <div data-testid='file-upload'>{selectedFile?.name || 'No file'}</div>
  ),
  ActionButtons: () => <div data-testid='action-buttons'>Action Buttons</div>,
}));

export const defaultProcessingWorkflowProps: ProcessingWorkflowProps = {
  selectedFile: null,
  loading: false,
  error: null,
  hasContent: false,
  onFileSelect: jest.fn(),
  onProcess: jest.fn(),
  onReset: jest.fn(),
  onClearError: jest.fn(),
};

export const setupProcessingWorkflowTest = (
  overrides: Partial<ProcessingWorkflowProps> = {}
) => {
  const props: ProcessingWorkflowProps = {
    ...defaultProcessingWorkflowProps,
    ...overrides,
  };
  const utils = render(<ProcessingWorkflow {...props} />);
  return {
    props,
    ...utils,
    mockFileDocx,
    mockFileMd,
  };
};

describe('ProcessingWorkflow', () => {
  it('renders file upload section', () => {
    setupProcessingWorkflowTest();
    expect(screen.getByText('📤 Upload Document')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });

  it('shows action buttons when file is selected', () => {
    setupProcessingWorkflowTest({ selectedFile: mockFileDocx });
    expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    setupProcessingWorkflowTest({ loading: true });
    expect(screen.getByText(/processing document/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    setupProcessingWorkflowTest({ error: 'Test error' });
    expect(screen.getByText('❌ Error:')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows reset state when content is loaded', () => {
    setupProcessingWorkflowTest({ hasContent: true });
    expect(screen.getByText('Content Loaded Successfully')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start over/i })
    ).toBeInTheDocument();
    expect(screen.queryByText('📤 Upload Document')).not.toBeInTheDocument();
  });
});
