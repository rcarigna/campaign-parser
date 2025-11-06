import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Home from './page';
import { useFileManager, useCampaignParser } from '@/hooks';

// Mock the API
jest.mock('@/client/api', () => ({
  loadDemoData: jest.fn().mockResolvedValue({
    filename: 'demo.md',
    type: 'markdown',
    content: { raw: '# Demo', html: '<h1>Demo</h1>' },
    entities: [],
    metadata: {
      size: 100,
      lastModified: '2024-01-01',
      mimeType: 'text/markdown',
    },
  }),
}));

// Mock the custom hooks
jest.mock('@/hooks', () => ({
  useCampaignParser: jest.fn().mockReturnValue({
    processDocument: jest.fn(),
    loadDemoData: jest.fn(),
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
    expect(screen.getByText('🎭 Try the Demo')).toBeInTheDocument();
  });

  it('includes demo button', () => {
    render(<Home />);
    expect(
      screen.getByRole('button', { name: /load demo session/i })
    ).toBeInTheDocument();
  });

  it('includes file upload section', () => {
    render(<Home />);
    expect(
      screen.getByLabelText(/Click to select a file or drag and drop/i)
    ).toBeInTheDocument();
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
      loadDemoData: jest.fn(),
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

  it('calls the appropriate function for loading demo data', async () => {
    const mockLoadDemoData = jest.fn();
    (useCampaignParser as jest.Mock).mockReturnValue({
      processDocument: jest.fn(),
      loadDemoData: mockLoadDemoData,
      clearResults: jest.fn(),
      clearError: jest.fn(),
      discardEntity: jest.fn(),
      restoreEntities: jest.fn(),
      loading: false,
      error: null,
      parsedData: null,
      entities: [],
    });

    // Make sure no file is selected so demo button appears
    (useFileManager as jest.Mock).mockReturnValue({
      selectFile: jest.fn(),
      clearFile: jest.fn(),
      clearError: jest.fn(),
      selectedFile: null, // No file selected
      error: null,
    });

    render(<Home />);

    const demoButton = screen.getByRole('button', {
      name: /load demo session/i,
    });
    await userEvent.click(demoButton);

    // Should call loadDemoData from the API and then call the hook method
    expect(mockLoadDemoData).toHaveBeenCalled();
  });
});
