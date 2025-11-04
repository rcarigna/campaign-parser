import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

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

// Mock the components (simplified for testing)
jest.mock('@/components', () => ({
  Header: () => <div data-testid='header'>Campaign Document Parser</div>,
  FileUpload: () => <div data-testid='file-upload'>File Upload Component</div>,
  ActionButtons: () => <div data-testid='action-buttons'>Action Buttons</div>,
  ParsedResults: () => <div data-testid='parsed-results'>Parsed Results</div>,
  EntityViewer: () => <div data-testid='entity-viewer'>Entity Viewer</div>,
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
    expect(screen.getByTestId('header')).toBeInTheDocument();

    // File upload should be present
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();

    // Welcome section should be present
    expect(screen.getByText('📜')).toBeInTheDocument();
  });
});
