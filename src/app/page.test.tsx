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

  it('shows demo tab by default', () => {
    render(<Home />);
    expect(screen.getByText('🎭 Try the Demo')).toBeInTheDocument();
  });

  it('includes tab navigation', () => {
    render(<Home />);

    // Both tabs should be present
    expect(screen.getByRole('button', { name: /try demo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload document/i })).toBeInTheDocument();
  });

  it('can switch to upload tab', async () => {
    render(<Home />);
    
    const uploadTab = screen.getByRole('button', { name: /upload document/i });
    await userEvent.click(uploadTab);

    // After switching, should see upload section
    expect(
      screen.getByLabelText(/Click to select a file or drag and drop/i)
    ).toBeInTheDocument();
  });

  it('shows welcome message in upload tab when no data is available', async () => {
    render(<Home />);
    
    const uploadTab = screen.getByRole('button', { name: /upload document/i });
    await userEvent.click(uploadTab);
    
    expect(screen.getByText('Welcome to Campaign Parser')).toBeInTheDocument();
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
    
    // Switch to upload tab first
    const uploadTab = screen.getByRole('button', { name: /upload document/i });
    await userEvent.click(uploadTab);
    
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
    
    // Switch to upload tab first
    const uploadTab = screen.getByRole('button', { name: /upload document/i });
    await userEvent.click(uploadTab);
    
    const clearButton = screen.getByRole('button', { name: /reset/i });
    await userEvent.click(clearButton);
    expect(mockClearFile).toHaveBeenCalled();
  });

  it('calls the appropriate function for processing the selected file', async () => {
    const mockProcessDocument = jest.fn();
    (useFileManager as jest.Mock).mockReturnValue({
      selectFile: jest.fn(),
      clearFile: jest.fn(),
      clearError: jest.fn(),
      selectedFile: new File(['test content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      error: null,
    });
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
    
    // Switch to upload tab first
    const uploadTab = screen.getByRole('button', { name: /upload document/i });
    await userEvent.click(uploadTab);
    
    const processButton = screen.getByRole('button', { name: /parse/i });
    await userEvent.click(processButton);
    expect(mockProcessDocument).toHaveBeenCalled();
  });
});
