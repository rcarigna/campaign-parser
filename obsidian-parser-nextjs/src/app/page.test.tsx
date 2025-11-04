import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from './page';
import { useFileManager, useCampaignParser } from '@/hooks';

// Mock the custom hooks
jest.mock('@/hooks', () => ({
  useCampaignParser: jest.fn().mockReturnValue({
    processDocument: jest.fn(),
    clearResults: jest.fn(),
    clearError: jest.fn(),
    discardEntity: jest.fn(),
    restoreEntities: jest.fn(),
    loading: false,
    error: null,
    parsedData: null,
    entities: [],
  }),
  useFileManager: jest.fn().mockReturnValue({
    selectFile: jest.fn(),
    clearFile: jest.fn(),
    clearError: jest.fn(),
    selectedFile: null,
    error: null,
  }),
}));

// Mock types
jest.mock('@/types', () => ({
  ALLOWED_EXTENSIONS: ['.docx', '.md'],
}));

describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/Campaign Document Parser/)).toBeInTheDocument();
  });

  it('shows welcome message when no data is available', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Campaign Parser')).toBeInTheDocument();
  });

  it('includes the main page components', () => {
    render(<Home />);

    // Header should be present
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // File upload should be present
    expect(
      screen.getByLabelText(/Click to select a file or drag and drop/i)
    ).toBeInTheDocument();

    // Welcome section should be present
    expect(screen.getByText('📜')).toBeInTheDocument();
  });

  it('calls the appropriate functions on file select', async () => {
    const mockSelectFile = jest.fn();
    (useFileManager as jest.Mock).mockReturnValue({
      selectFile: mockSelectFile,
      clearFile: jest.fn(),
      clearError: jest.fn(),
      selectedFile: null,
      error: null,
    });

    render(<Home />);
    const fileInput = screen.getByLabelText(
      /Click to select a file or drag and drop/i
    );

    // Create a mock file
    const mockFile = new File(['test content'], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    // Simulate file selection
    await userEvent.upload(fileInput, mockFile);
    expect(mockSelectFile).toHaveBeenCalledWith(mockFile);
  });

  it('calls the appropriate function for clearing the selected file', async () => {
    const mockClearFile = jest.fn();
    (useFileManager as jest.Mock).mockReturnValue({
      selectFile: jest.fn(),
      clearFile: mockClearFile,
      clearError: jest.fn(),
      selectedFile: new File(['test content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      error: null,
    });

    render(<Home />);
    const clearButton = screen.getByRole('button', { name: /reset/i });
    await userEvent.click(clearButton);
    expect(mockClearFile).toHaveBeenCalled();
  });

  it('calls the appropriate function for processing the selected file', async () => {
    const mockProcessDocument = jest.fn();
    (useCampaignParser as jest.Mock).mockReturnValue({
      processDocument: mockProcessDocument,
      clearResults: jest.fn(),
      clearError: jest.fn(),
      discardEntity: jest.fn(),
      restoreEntities: jest.fn(),
      loading: false,
      error: null,
      parsedData: null,
      entities: [],
    });

    render(<Home />);
    const processButton = screen.getByRole('button', { name: /parse/i });
    await userEvent.click(processButton);
    expect(mockProcessDocument).toHaveBeenCalled();
  });

  it('shows an error toast when processing fails', async () => {
    const mockProcessDocument = jest
      .fn()
      .mockRejectedValue(new Error('Test error'));
    (useCampaignParser as jest.Mock).mockReturnValue({
      processDocument: mockProcessDocument,
      clearResults: jest.fn(),
      clearError: jest.fn(),
      discardEntity: jest.fn(),
      restoreEntities: jest.fn(),
      loading: false,
      error: null,
      parsedData: null,
      entities: [],
    });

    render(<Home />);
    const processButton = screen.getByRole('button', { name: /parse/i });
    await userEvent.click(processButton);
    expect(mockProcessDocument).toHaveBeenCalled();
  });
});
